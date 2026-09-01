from dataclasses import dataclass
from json import JSONDecodeError
from math import isfinite
from threading import Lock
from time import monotonic
from typing import Literal, Protocol
from uuid import UUID

import jwt
from jwt import PyJWK, PyJWKClient
from jwt.exceptions import (
    InvalidTokenError,
    PyJWKClientConnectionError,
    PyJWKClientError,
    PyJWKSetError,
)

MAX_ACCESS_TOKEN_LENGTH = 16_384
MAX_KEY_ID_LENGTH = 256
JWT_CLOCK_SKEW_SECONDS = 30
UNKNOWN_KEY_REFRESH_COOLDOWN_SECONDS = 10
KNOWN_KEY_CACHE_SECONDS = 300
REQUIRED_CLAIMS = (
    "iss",
    "aud",
    "exp",
    "iat",
    "sub",
    "role",
    "aal",
    "session_id",
    "is_anonymous",
)


class InvalidAccessToken(Exception):
    """The presented credential cannot authenticate a learner."""


class LearnerAccessDenied(Exception):
    """The token is valid but does not represent an ordinary learner."""


class AuthVerificationUnavailable(Exception):
    """The trusted signing keys cannot currently be obtained."""


class SigningKeyNotFound(Exception):
    """The trusted key set does not contain the requested key ID."""


class SigningKeySourceUnavailable(Exception):
    """The remote key set is unavailable or malformed."""


class SigningKeyResolver(Protocol):
    def get_signing_key(self, key_id: str) -> PyJWK: ...


@dataclass(frozen=True)
class AuthenticatedLearner:
    user_id: UUID
    session_id: UUID
    assurance_level: Literal["aal1", "aal2"]


class SupabaseJwksResolver:
    def __init__(
        self,
        jwks_url: str,
        jwks_client: PyJWKClient | None = None,
    ) -> None:
        self._client = jwks_client or PyJWKClient(
            jwks_url,
            cache_jwk_set=True,
            cache_keys=False,
            lifespan=300,
            timeout=5,
        )
        self._refresh_lock = Lock()
        self._next_unknown_key_refresh = 0.0
        self._source_unavailable_until = 0.0
        self._known_keys: dict[str, tuple[PyJWK, float]] = {}

    def get_signing_key(self, key_id: str) -> PyJWK:
        with self._refresh_lock:
            now = monotonic()
            known_key = self._known_keys.get(key_id)
            if known_key is not None:
                signing_key, expires_at = known_key
                if now < expires_at:
                    return signing_key
                del self._known_keys[key_id]

            if now < self._source_unavailable_until:
                raise SigningKeySourceUnavailable

            try:
                signing_key = self._find_signing_key(key_id, refresh=False)
            except SigningKeySourceUnavailable:
                self._source_unavailable_until = (
                    now + UNKNOWN_KEY_REFRESH_COOLDOWN_SECONDS
                )
                raise
            if signing_key is not None:
                self._remember_key(key_id, signing_key, now)
                return signing_key

            if now < self._next_unknown_key_refresh:
                raise SigningKeyNotFound

            self._next_unknown_key_refresh = (
                now + UNKNOWN_KEY_REFRESH_COOLDOWN_SECONDS
            )
            try:
                signing_key = self._find_signing_key(key_id, refresh=True)
            except SigningKeySourceUnavailable:
                self._source_unavailable_until = (
                    now + UNKNOWN_KEY_REFRESH_COOLDOWN_SECONDS
                )
                raise
            if signing_key is None:
                raise SigningKeyNotFound
            self._remember_key(key_id, signing_key, now)
            return signing_key

    def _remember_key(self, key_id: str, signing_key: PyJWK, now: float) -> None:
        self._known_keys[key_id] = (signing_key, now + KNOWN_KEY_CACHE_SECONDS)

    def _find_signing_key(self, key_id: str, *, refresh: bool) -> PyJWK | None:
        try:
            key_set = self._client.get_jwk_set(refresh=refresh)
            matches = [key for key in key_set.keys if key.key_id == key_id]
        except (
            AttributeError,
            JSONDecodeError,
            PyJWKClientConnectionError,
            PyJWKClientError,
            PyJWKSetError,
            TypeError,
            ValueError,
        ) as exc:
            raise SigningKeySourceUnavailable from exc

        if len(matches) > 1:
            raise SigningKeySourceUnavailable
        return matches[0] if matches else None


class SupabaseJwtVerifier:
    def __init__(
        self,
        supabase_url: str,
        algorithms: tuple[str, ...],
        key_resolver: SigningKeyResolver | None = None,
    ) -> None:
        if not algorithms or any(
            algorithm not in {"ES256", "RS256"} for algorithm in algorithms
        ):
            raise ValueError("Only asymmetric Supabase JWT algorithms are supported")

        self._issuer = f"{supabase_url.rstrip('/')}/auth/v1"
        self._algorithms = tuple(dict.fromkeys(algorithms))
        self._key_resolver = key_resolver or SupabaseJwksResolver(
            f"{self._issuer}/.well-known/jwks.json"
        )

    def verify(self, token: str) -> AuthenticatedLearner:
        if len(token) > MAX_ACCESS_TOKEN_LENGTH or token.count(".") != 2:
            raise InvalidAccessToken

        try:
            header = jwt.get_unverified_header(token)
        except InvalidTokenError as exc:
            raise InvalidAccessToken from exc

        algorithm = header.get("alg")
        key_id = header.get("kid")
        if (
            algorithm not in self._algorithms
            or not isinstance(key_id, str)
            or not key_id
            or len(key_id) > MAX_KEY_ID_LENGTH
            or any(name in header for name in ("jku", "jwk", "x5u"))
        ):
            raise InvalidAccessToken

        try:
            signing_key = self._key_resolver.get_signing_key(key_id)
        except SigningKeySourceUnavailable as exc:
            raise AuthVerificationUnavailable from exc
        except SigningKeyNotFound as exc:
            raise InvalidAccessToken from exc

        if signing_key.algorithm_name != algorithm:
            raise InvalidAccessToken

        try:
            claims = jwt.decode(
                token,
                signing_key.key,
                algorithms=list(self._algorithms),
                audience="authenticated",
                issuer=self._issuer,
                leeway=JWT_CLOCK_SKEW_SECONDS,
                options={"require": list(REQUIRED_CLAIMS)},
            )
        except (InvalidTokenError, OverflowError, TypeError, ValueError) as exc:
            raise InvalidAccessToken from exc

        for claim_name in ("exp", "iat", "nbf"):
            value = claims.get(claim_name)
            if value is None and claim_name == "nbf":
                continue
            if (
                isinstance(value, bool)
                or not isinstance(value, (int, float))
                or not isfinite(value)
            ):
                raise InvalidAccessToken

        try:
            user_id = _parse_uuid_claim(claims, "sub")
            session_id = _parse_uuid_claim(claims, "session_id")
        except (TypeError, ValueError) as exc:
            raise InvalidAccessToken from exc

        if claims.get("role") != "authenticated" or claims.get("is_anonymous") is not False:
            raise LearnerAccessDenied

        assurance_level = claims.get("aal")
        if assurance_level not in {"aal1", "aal2"}:
            raise InvalidAccessToken

        return AuthenticatedLearner(
            user_id=user_id,
            session_id=session_id,
            assurance_level=assurance_level,
        )


def _parse_uuid_claim(claims: dict[str, object], name: str) -> UUID:
    value = claims.get(name)
    if not isinstance(value, str):
        raise TypeError(f"{name} must be a string")
    return UUID(value)
