from datetime import datetime
import uuid
from typing import Optional, List, Dict
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
    seat_plan: Optional[str] = ""
    
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
                "gallery": ["https://images.app.goo.gl/3TLpJJwGzicrDLN78", "https://images.app.goo.gl/3TLpJJwGzicrDLN78"],
                "published": False
            }
        }
        
class EventInDB(Event):
    host_id: str = Field(...)
    tickets: List[str]
    published: bool = False
    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "host_id": "12345",
                "title": "Movie Night",
                "host_name": "DJ Khaled",
                "category": "Movie",
                "address": "123 Seaseme Street",
                "postcode" : "1234",
                "start_dt": "2022-10-11T12:55",
                "end_dt": "2022-11-11T03:55",
                "details:": "",
                "image_url": "https://images.app.goo.gl/3TLpJJwGzicrDLN78",
                "gallery": ["https://images.app.goo.gl/3TLpJJwGzicrDLN78", "https://images.app.goo.gl/3TLpJJwGzicrDLN78"] 
            }
        }
        
class EventUpdate(BaseModel):
    title: Optional[str]
    host_name:Optional[str]
    category:Optional[str]
    address: Optional[str]
    postcode: Optional[int]
    start_dt: Optional[str] 
    end_dt: Optional[str]
    details: Optional[str]
    image_url: Optional[str]
    gallery: Optional[List[str]]
    published: Optional[bool] = False
    seat_plan: Optional[str]
    
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

class Seat(BaseModel):
    type_id: Optional[str] = ""
    ticket_id: Optional[str] = ""
    active: bool = True 

class SeatPlan(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    seats: List[List[Seat]] #starts 0-0
    
    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example":{
                  "seats": [
                    [
                      {
                        "type_id": "fb158264-9ff7-43c2-8754-5902b5bf3073",
                        "ticket_id": "",
                        "active": True
                      },
                      {
                        "type_id": "fb158264-9ff7-43c2-8754-5902b5bf3073",
                        "ticket_id": "",
                        "active": True
                      },
                      {
                        "type_id": "fb158264-9ff7-43c2-8754-5902b5bf3073",
                        "ticket_id": "",
                        "active": True
                      },
                      {
                        "type_id": "fb158264-9ff7-43c2-8754-5902b5bf3073",
                        "ticket_id": "",
                        "active": True
                      }
                    ]
                  ]
                }
        }
class SeatPlanInDB(SeatPlan):
    event_id: str


    
# Event: event_id, title, host, start dateTime, end dateTime, description, thumbnail (photo shown in card), gallery (optional, list of photos), video(optional), categories, location attendants:[Users], reviews

# Ticket: event_id, types, price, #of_tickets, 

# reviews: review_id, replies:[review_id], user, content, datetime
