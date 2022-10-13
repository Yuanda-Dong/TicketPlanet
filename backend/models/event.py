from datetime import datetime
import uuid
from typing import Optional, List
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
    title: str = Field(...)
    host_name:str = Field(...)
    category:str = Field(...)
    address:str = Field(...)
    postcode: int = Field(...)
    start_dt: datetime = Field()
    end_dt: datetime = Field()
    details: Optional[str]
    image_url: Optional[str]
    gallery: Optional[List[str]]
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
                "title": "Movie Night",
                "host_name": "DJ Khaled",
                "category": "Movie",
                "address": "123 Seaseme Street",
                "postcode" : "1234",
                "start_dt": "2022-10-11T12:55",
                "end_dt": "2022-11-11T03:55",
                "details:": "",
                "image_url": "https://images.app.goo.gl/3TLpJJwGzicrDLN78",
                "gallery": "[https://images.app.goo.gl/3TLpJJwGzicrDLN78, https://images.app.goo.gl/3TLpJJwGzicrDLN78]"
            }
        }
        
class EventInDB(Event):
    host_id: str = Field(...)
    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "title": "Movie Night",
                "host_name": "DJ Khaled",
                "category": "Movie",
                "address": "123 Seaseme Street",
                "postcode" : "1234",
                "start_dt": "2022-10-11T12:55",
                "end_dt": "2022-11-11T03:55",
                "details:": "",
                "image_url": "https://images.app.goo.gl/3TLpJJwGzicrDLN78",
                "gallery": "[https://images.app.goo.gl/3TLpJJwGzicrDLN78, https://images.app.goo.gl/3TLpJJwGzicrDLN78]"
            }
        }
        
class EventUpdate(BaseModel):
    title: str = Field(...)
    host_name:str = Field(...)
    category:str = Field(...)
    address: Optional[str]
    postcode: Optional[int]
    start_dt: Optional[datetime]
    end_dt: Optional[datetime]
    details: Optional[str]
    image_url: Optional[str]
    gallery: Optional[List[str]]
    
    @validator('postcode')
    def postcode_must_be_4_digts(cls, v):
        if len(str(v)) != 4:
            raise ValueError('Postcode must be 4 digits')
        return v

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "title": "Movie Night",
                "host_name": "DJ Khaled",
                "category": "Movie",
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
