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
