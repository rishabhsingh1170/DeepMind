from typing import Annotated, Any

from bson import ObjectId
from pydantic import BeforeValidator


def validate_object_id(value: Any) -> str:
    if isinstance(value, ObjectId):
        return str(value)
    if isinstance(value, str) and ObjectId.is_valid(value):
        return value
    raise ValueError("Invalid MongoDB ObjectId")


ObjectIdStr = Annotated[str, BeforeValidator(validate_object_id)]