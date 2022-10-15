# from datetime import datetime
from datetime import datetime
from lib2to3.pytree import Base
import uuid
from typing import Optional, List
from pydantic import BaseModel,Field


class Reply(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    base_comment: str
    reply_to: str #userId --> backend get username
    #reply_preview: str #first 50 characters
    message: str 
    user_id: str

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "ticket_name": "General Admission",
                "price": "15",
                "availability":"55"
            }
        }


class BaseComment(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    message: str 
    user_id: str
    replies: List(Reply)
    
    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "ticket_name": "General Admission",
                "price": "15",
                "availability":"55"
            }
        }
        

class ReplyInDB(Reply):
    username: str
    reply_username: str
    date: datetime
    
class BaseCommentInDB(BaseComment):
   username: str
   date: datetime