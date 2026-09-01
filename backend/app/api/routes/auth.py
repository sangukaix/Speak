from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.dependencies import get_current_learner
from app.core.auth import AuthenticatedLearner
from app.schemas.auth import CurrentLearnerResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/me", response_model=CurrentLearnerResponse)
async def get_authenticated_learner(
    learner: Annotated[AuthenticatedLearner, Depends(get_current_learner)],
) -> CurrentLearnerResponse:
    return CurrentLearnerResponse(user_id=learner.user_id)
