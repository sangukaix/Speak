from uuid import UUID

from pydantic import BaseModel


class CurrentLearnerResponse(BaseModel):
    user_id: UUID
