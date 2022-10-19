# from datetime import datetime
from enum import Enum
import uuid
from typing import Optional, List
from pydantic import BaseModel,Field

class Ticket(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    ticket_name :str = Field(...)
    price: float
    availability: int
    
    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "ticket_name": "General Admission",
                "price": "15",
                "availability":"55"
            }
        }

class TicketInDB(Ticket):
    event_id: str
    host_id: str
    
class TicketUpdate(BaseModel):
    ticket_name :Optional[str]
    price: Optional[float]
    availability: Optional[int]
    

class TicketStatus(str, Enum):
    active="active"
    decativate = "deactive"
    refunded = "refunded"

class TicketInstance(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    base_id: str
    seat_number: Optional[str]
    section_number: Optional[str]
    user_id: str
    status: TicketStatus = "deactive"
    