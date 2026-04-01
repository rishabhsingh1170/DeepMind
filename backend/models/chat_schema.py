from enum import Enum
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import datetime

try:
    from backend.models.common import ObjectIdStr
except ModuleNotFoundError:
    from models.common import ObjectIdStr


class ChatBase(BaseModel):
    admin_id: ObjectIdStr
    company_id: ObjectIdStr
    document_id: ObjectIdStr


class ChatCreate(ChatBase):
    pass


class ChatInDB(ChatBase):
    id: ObjectIdStr = Field(alias="_id")
    chat_token: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(populate_by_name=True)


class ChatResponse(ChatInDB):
    chat_token: Optional[str] = None


class ChatAdminResponse(ChatResponse):
    chat_token: str


class AccessRequestStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    denied = "denied"


class ChatAccessRequestCreate(BaseModel):
    chat_token: str


class ChatAccessDecisionAction(str, Enum):
    approve = "approve"
    deny = "deny"


class ChatAccessDecision(BaseModel):
    action: ChatAccessDecisionAction


class ChatAccessRequestResponse(BaseModel):
    id: ObjectIdStr = Field(alias="_id")
    chat_id: ObjectIdStr
    admin_id: ObjectIdStr
    employee_id: ObjectIdStr
    status: AccessRequestStatus
    requested_at: datetime
    reviewed_at: Optional[datetime] = None
    reviewed_by: Optional[ObjectIdStr] = None

    model_config = ConfigDict(populate_by_name=True)


class ChatTokenResponse(BaseModel):
    chat_id: ObjectIdStr
    chat_token: str


class ChatSchema(ChatCreate):
    pass
