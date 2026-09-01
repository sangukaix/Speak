from collections.abc import Iterator
from dataclasses import dataclass
from time import time
from uuid import UUID, uuid4

import jwt
import pytest
from cryptography.hazmat.primitives.asymmetric import ec, rsa
from fastapi.testclient import TestClient
from jwt import PyJWK
from jwt.algorithms import ECAlgorithm, RSAAlgorithm
from jwt.exceptions import PyJWKClientConnectionError

from app.api.dependencies import get_jwt_verifier
from app.core.auth import (
    SigningKeyNotFound,
    SigningKeySourceUnavailable,
    SupabaseJwksResolver,
    SupabaseJwtVerifier,
)
from app.core.config import get_settings
from app.main import app

TEST_SUPABASE_URL = "https://test-project.supabase.co"
TEST_ISSUER = f"{TEST_SUPABASE_URL}/auth/v1"
TEST_KEY_ID = "test-signing-key"


@dataclass(frozen=True)
class SigningMaterial:
    private_key: ec.EllipticCurvePrivateKey
    public_jwk: PyJWK


class StaticKeyResolver:
    def __init__(self, key_id: str, public_jwk: PyJWK) -> None:
        self._key_id = key_id
        self._public_jwk = public_jwk

    def get_signing_key(self, key_id: str) -> PyJWK:
        if key_id != self._key_id:
            raise SigningKeyNotFound
        return self._public_jwk


class UnavailableKeyResolver:
    def get_signing_key(self, key_id: str) -> PyJWK:
        raise SigningKeySourceUnavailable


class FakeJwkSet:
    def __init__(self, keys: list[object]) -> None:
        self.keys = keys


class CountingJwksClient:
    def __init__(self, keys: list[PyJWK]) -> None:
        self._key_set = FakeJwkSet(keys)
        self.refresh_calls = 0

    def get_jwk_set(self, refresh: bool = False) -> FakeJwkSet:
        if refresh:
            self.refresh_calls += 1
        return self._key_set


class FailingRefreshJwksClient(CountingJwksClient):
    def get_jwk_set(self, refresh: bool = False) -> FakeJwkSet:
        if refresh:
            self.refresh_calls += 1
            raise PyJWKClientConnectionError("JWKS is unavailable")
        return self._key_set


class MalformedJwksClient:
    def get_jwk_set(self, refresh: bool = False) -> FakeJwkSet:
        return FakeJwkSet([None])


@pytest.fixture
def signing_material() -> SigningMaterial:
    private_key = ec.generate_private_key(ec.SECP256R1())
    public_jwk_data = ECAlgorithm.to_jwk(private_key.public_key(), as_dict=True)
    public_jwk_data.update(
        {
            "alg": "ES256",
            "kid": TEST_KEY_ID,
            "use": "sig",
        }
    )
    return SigningMaterial(
        private_key=private_key,
        public_jwk=PyJWK.from_dict(public_jwk_data),
    )


@pytest.fixture
def verifier(signing_material: SigningMaterial) -> SupabaseJwtVerifier:
    return SupabaseJwtVerifier(
        TEST_SUPABASE_URL,
        ("ES256",),
        StaticKeyResolver(TEST_KEY_ID, signing_material.public_jwk),
    )


@pytest.fixture
def authenticated_client(verifier: SupabaseJwtVerifier) -> Iterator[TestClient]:
    app.dependency_overrides[get_jwt_verifier] = lambda: verifier
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()


def _claims(**overrides: object) -> dict[str, object]:
    now = int(time())
    claims: dict[str, object] = {
        "iss": TEST_ISSUER,
        "aud": "authenticated",
        "exp": now + 300,
        "iat": now,
        "sub": str(uuid4()),
        "role": "authenticated",
        "aal": "aal1",
        "session_id": str(uuid4()),
        "is_anonymous": False,
    }
    claims.update(overrides)
    return claims


def _token(
    signing_material: SigningMaterial,
    claims: dict[str, object],
    *,
    key_id: str = TEST_KEY_ID,
) -> str:
    return jwt.encode(
        claims,
        signing_material.private_key,
        algorithm="ES256",
        headers={"kid": key_id},
    )


def _get_me(client: TestClient, token: str):
    return client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})


def test_auth_me_requires_a_bearer_token() -> None:
    response = TestClient(app).get("/auth/me")

    assert response.status_code == 401
    assert response.headers["www-authenticate"] == "Bearer"
    assert response.json() == {"detail": "Invalid authentication credentials"}


def test_auth_me_returns_only_the_verified_user_id(
    authenticated_client: TestClient,
    signing_material: SigningMaterial,
) -> None:
    user_id = uuid4()
    token = _token(
        signing_material,
        _claims(
            sub=str(user_id),
            email="private@example.com",
            session_id=str(uuid4()),
        ),
    )

    response = _get_me(authenticated_client, token)

    assert response.status_code == 200
    assert response.json() == {"user_id": str(user_id)}
    assert "private@example.com" not in response.text
    assert token not in response.text


@pytest.mark.parametrize(
    "claim_overrides",
    [
        {"exp": 1},
        {"iss": "https://attacker.example/auth/v1"},
        {"aud": "anon"},
        {"iat": []},
        {"sub": "not-a-uuid"},
        {"session_id": "not-a-uuid"},
    ],
)
def test_auth_me_rejects_invalid_claims(
    authenticated_client: TestClient,
    signing_material: SigningMaterial,
    claim_overrides: dict[str, object],
) -> None:
    response = _get_me(
        authenticated_client,
        _token(signing_material, _claims(**claim_overrides)),
    )

    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid authentication credentials"}


def test_auth_me_rejects_a_missing_required_claim(
    authenticated_client: TestClient,
    signing_material: SigningMaterial,
) -> None:
    claims = _claims()
    del claims["session_id"]

    response = _get_me(authenticated_client, _token(signing_material, claims))

    assert response.status_code == 401


def test_auth_me_rejects_a_wrong_signature(
    authenticated_client: TestClient,
) -> None:
    other_key = ec.generate_private_key(ec.SECP256R1())
    token = jwt.encode(
        _claims(),
        other_key,
        algorithm="ES256",
        headers={"kid": TEST_KEY_ID},
    )

    response = _get_me(authenticated_client, token)

    assert response.status_code == 401


def test_auth_me_rejects_an_unknown_key_id(
    authenticated_client: TestClient,
    signing_material: SigningMaterial,
) -> None:
    response = _get_me(
        authenticated_client,
        _token(signing_material, _claims(), key_id="unknown-key"),
    )

    assert response.status_code == 401


@pytest.mark.parametrize("api_key", ["sb_publishable_test", "sb" + "_secret_test"])
def test_auth_me_rejects_api_keys_as_learner_tokens(
    authenticated_client: TestClient,
    api_key: str,
) -> None:
    response = _get_me(authenticated_client, api_key)

    assert response.status_code == 401


def test_auth_me_rejects_hs256(
    authenticated_client: TestClient,
) -> None:
    token = jwt.encode(
        _claims(),
        "test-only-shared-key-with-32-bytes-minimum",
        algorithm="HS256",
        headers={"kid": TEST_KEY_ID},
    )

    response = _get_me(authenticated_client, token)

    assert response.status_code == 401


@pytest.mark.parametrize(
    "claim_overrides",
    [
        {"role": "service_role"},
        {"is_anonymous": True},
    ],
)
def test_auth_me_denies_non_learner_tokens(
    authenticated_client: TestClient,
    signing_material: SigningMaterial,
    claim_overrides: dict[str, object],
) -> None:
    response = _get_me(
        authenticated_client,
        _token(signing_material, _claims(**claim_overrides)),
    )

    assert response.status_code == 403
    assert response.json() == {"detail": "Authenticated learner access required"}


def test_auth_me_fails_closed_when_jwks_is_unavailable(
    signing_material: SigningMaterial,
) -> None:
    verifier = SupabaseJwtVerifier(
        TEST_SUPABASE_URL,
        ("ES256",),
        UnavailableKeyResolver(),
    )
    app.dependency_overrides[get_jwt_verifier] = lambda: verifier
    try:
        response = _get_me(
            TestClient(app),
            _token(signing_material, _claims()),
        )
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 503
    assert response.json() == {"detail": "Authentication verification is unavailable"}


def test_unknown_key_ids_refresh_jwks_at_a_bounded_rate(
    signing_material: SigningMaterial,
) -> None:
    client = CountingJwksClient([signing_material.public_jwk])
    resolver = SupabaseJwksResolver(
        f"{TEST_ISSUER}/.well-known/jwks.json",
        client,
    )

    with pytest.raises(SigningKeyNotFound):
        resolver.get_signing_key("unknown-key-one")
    with pytest.raises(SigningKeyNotFound):
        resolver.get_signing_key("unknown-key-two")

    assert client.refresh_calls == 1


def test_failed_jwks_refresh_remains_unavailable_during_cooldown(
    signing_material: SigningMaterial,
) -> None:
    client = FailingRefreshJwksClient([signing_material.public_jwk])
    resolver = SupabaseJwksResolver(
        f"{TEST_ISSUER}/.well-known/jwks.json",
        client,
    )

    with pytest.raises(SigningKeySourceUnavailable):
        resolver.get_signing_key("unknown-key-one")
    with pytest.raises(SigningKeySourceUnavailable):
        resolver.get_signing_key("unknown-key-two")

    assert client.refresh_calls == 1


def test_malformed_jwks_entries_are_unavailable() -> None:
    resolver = SupabaseJwksResolver(
        f"{TEST_ISSUER}/.well-known/jwks.json",
        MalformedJwksClient(),
    )

    with pytest.raises(SigningKeySourceUnavailable):
        resolver.get_signing_key(TEST_KEY_ID)


def test_verifier_accepts_a_configured_rs256_rotation_key() -> None:
    private_key = rsa.generate_private_key(public_exponent=65_537, key_size=2_048)
    public_jwk_data = RSAAlgorithm.to_jwk(private_key.public_key(), as_dict=True)
    public_jwk_data.update(
        {
            "alg": "RS256",
            "kid": "rotation-key",
            "use": "sig",
        }
    )
    verifier = SupabaseJwtVerifier(
        TEST_SUPABASE_URL,
        ("ES256", "RS256"),
        StaticKeyResolver("rotation-key", PyJWK.from_dict(public_jwk_data)),
    )
    user_id = uuid4()
    token = jwt.encode(
        _claims(sub=str(user_id)),
        private_key,
        algorithm="RS256",
        headers={"kid": "rotation-key"},
    )

    learner = verifier.verify(token)

    assert learner.user_id == user_id


def test_settings_reject_an_insecure_remote_supabase_url(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    get_settings.cache_clear()
    monkeypatch.setenv("SUPABASE_URL", "http://supabase.example")
    try:
        with pytest.raises(ValueError, match="HTTPS"):
            get_settings()
    finally:
        get_settings.cache_clear()


def test_auth_me_cors_preflight_allows_only_a_configured_origin() -> None:
    client = TestClient(app)
    allowed_response = client.options(
        "/auth/me",
        headers={
            "Origin": "http://127.0.0.1:8081",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "authorization",
        },
    )
    denied_response = client.options(
        "/auth/me",
        headers={
            "Origin": "https://untrusted.example",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "authorization",
        },
    )

    assert allowed_response.status_code == 200
    assert allowed_response.headers["access-control-allow-origin"] == "http://127.0.0.1:8081"
    assert "authorization" in allowed_response.headers["access-control-allow-headers"].lower()
    assert denied_response.status_code == 400
    assert "access-control-allow-origin" not in denied_response.headers
