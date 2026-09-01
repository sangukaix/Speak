from functools import lru_cache
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.auth import (
    AuthenticatedLearner,
    AuthVerificationUnavailable,
    InvalidAccessToken,
    LearnerAccessDenied,
    SupabaseJwtVerifier,
)
from app.core.config import Settings, get_settings

bearer_scheme = HTTPBearer(auto_error=False)


@lru_cache(maxsize=4)
def _build_jwt_verifier(
    supabase_url: str,
    algorithms: tuple[str, ...],
) -> SupabaseJwtVerifier:
    return SupabaseJwtVerifier(supabase_url, algorithms)


def get_jwt_verifier(
    settings: Annotated[Settings, Depends(get_settings)],
) -> SupabaseJwtVerifier | None:
    if settings.supabase_url is None:
        return None
    return _build_jwt_verifier(settings.supabase_url, settings.supabase_jwt_algorithms)


def get_current_learner(
    credentials: Annotated[
        HTTPAuthorizationCredentials | None,
        Depends(bearer_scheme),
    ],
    verifier: Annotated[SupabaseJwtVerifier | None, Depends(get_jwt_verifier)],
) -> AuthenticatedLearner:
    if credentials is None:
        raise _unauthorized()
    if verifier is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication verification is unavailable",
        )

    try:
        return verifier.verify(credentials.credentials)
    except InvalidAccessToken as exc:
        raise _unauthorized() from exc
    except LearnerAccessDenied as exc:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Authenticated learner access required",
        ) from exc
    except AuthVerificationUnavailable as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication verification is unavailable",
        ) from exc


def _unauthorized() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
