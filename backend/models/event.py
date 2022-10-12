from datetime import datetime
import uuid
from typing import Optional
from enum import Enum
from pydantic import BaseModel, Field, validator


class EventEnum(str, Enum):
    movie = 'movie'
    concert = 'concert'
    arts = 'arts'
    conference = 'conference'
    other = 'other'

class Event(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    host_name:str = Field(...)
    address:str = Field(...)
    postcode: int = Field(...)
    start_dt: datetime = Field()
    end_dt: datetime = Field()
    details: Optional[str]
    image_url: Optional[str]
    # preferences
    
    @validator('postcode')
    def postcode_must_be_4_digts(cls, v):
        if len(str(v)) != 4:
            raise ValueError('Postcode must be 4 digits')
        return v

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "host_name": "DJ Khaled",
                "address": "123 Seaseme Street",
                "postcode" : "1234",
                "start_dt": "2022-10-11T12:55",
                "end_dt": "2022-11-11T03:55",
                "details:": "",
                "image_url": "https://images.app.goo.gl/3TLpJJwGzicrDLN78"
            }
        }
        
class EventInDB(Event):
    host_id: str = Field(...)
        
class EventUpdate(BaseModel):
    host_name: Optional[str]
    address: Optional[str]
    postcode: Optional[int]
    start_dt: Optional[datetime]
    end_dt: Optional[datetime]
    details: Optional[str]
    image_url: Optional[str]
    
    @validator('postcode')
    def postcode_must_be_4_digts(cls, v):
        if len(str(v)) != 4:
            raise ValueError('Postcode must be 4 digits')
        return v

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "host_name": "DJ Khaled",
                "address": "123 Seaseme Street",
                "postcode" : "1234",
                "start_dt": "2022-10-11T12:55",
                "end_dt": "2022-11-11T03:55",
                "details:": "",
                "image_url": "https://images.app.goo.gl/3TLpJJwGzicrDLN78"
            }
        }


# Event: event_id, title, host, start dateTime, end dateTime, description, thumbnail (photo shown in card), gallery (optional, list of photos), video(optional), categories, location attendants:[Users], reviews

# Ticket: event_id, types, price, #of_tickets, 

# reviews: review_id, replies:[review_id], user, content, datetime
