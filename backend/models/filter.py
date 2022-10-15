# from datetime import datetime
from datetime import datetime
from lib2to3.pytree import Base
from sre_parse import CATEGORIES
from unicodedata import category
import uuid
from typing import Optional, List
from pydantic import BaseModel,Field


class Filter(BaseModel):
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    #reply_preview: str #first 50 characters
    category: Optional[List[str]]
    start_price: Optional[float]
    end_price: Optional[float]
    city: Optional[string]

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