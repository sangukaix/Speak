# API

Base URL in local development: `http://localhost:8000`.

## GET /health

Reports whether the FastAPI process can serve requests. Authentication is not required.

Response `200 OK`:

```json
{
  "status": "ok"
}
```

This endpoint currently checks application availability only. It does not claim that planned database or AI services are connected.

## GET /auth/me

Status: **Implemented cryptographic checkpoint. Live Supabase JWKS and active-session behavior are not verified yet.**

Returns the authenticated learner ID after FastAPI verifies the bearer token against the configured Supabase project's public asymmetric signing keys.

Request:

```http
GET /auth/me HTTP/1.1
Authorization: Bearer <learner-access-token>
```

Response `200 OK`:

```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

The verifier requires an algorithm in the backend allowlist (`ES256` by default; `ES256,RS256` only during a planned cross-algorithm rotation), trusted issuer, `authenticated` audience and role, expiry, issued-at time, learner UUID, session UUID, assurance level, and non-anonymous status. It derives the JWKS URL only from backend `SUPABASE_URL`; it never accepts a token-provided key URL and never needs the Supabase secret key.

| Status | Stable meaning |
|---|---|
| `401` | Bearer token is missing, malformed, expired, signed incorrectly, or belongs to another issuer/audience |
| `403` | A valid token does not represent an ordinary non-anonymous learner |
| `503` | Supabase configuration or trusted public signing keys are unavailable |

This route is a side-effect-free integration smoke check. It does not yet query authoritative active-session state, so it is not sufficient for account deletion or another security-sensitive operation. Those checks remain part of the planned `DELETE /account` boundary below.

## Planned Phase 3: DELETE /account

Status: **Contract only. This route and its CORS method are not implemented.**

Deletes the authenticated learner's Auth identity after fresh password proof. The request has no body and cannot name an email or user ID.

Request:

```http
DELETE /account HTTP/1.1
Authorization: Bearer <fresh-learner-access-token>
```

Before deletion, the client asks for the current password and sends it directly to Supabase Auth with `signInWithPassword`; FastAPI never receives it. The server then:

1. verifies the JWT signature, issuer, audience, expiry, project, `authenticated` role, and non-anonymous status;
2. requires a signed `amr` password timestamp no more than five minutes old;
3. verifies that the signed `session_id` is still active;
4. derives the only deletion target from signed `sub` and rejects/ignores any client identity value;
5. calls the provider's privileged user deletion with a backend-only secret.

Success is `204 No Content`. Expected error meanings are:

| Status | Stable meaning |
|---|---|
| `401` | Bearer token is missing, malformed, expired, revoked, or otherwise invalid |
| `403` | Learner is authenticated but fresh password proof is missing or too old |
| `409` | Provider-owned dependent data prevents safe deletion |
| `503` | Identity provider is temporarily unavailable or deletion is not confirmed |

Deleting the Auth user removes its sessions and refresh capability, but a previously issued stateless access token can remain cryptographically valid until expiry. Phase 3 protected FastAPI requests therefore validate session existence and must reject a pre-deletion token immediately. Future direct database access needs an equivalent bounded or closed revocation policy before it ships.

When this endpoint is implemented, browser support must add `DELETE` (and its middleware-managed `OPTIONS` preflight) to the CORS policy for configured origins. The current `allow_methods=["GET"]` remains honest until the route exists.
