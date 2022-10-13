# from datetime import datetime
import uuid
from typing import Optional, List
from pydantic import BaseModel,Field

class Ticket(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    eventId: str
    ticket_name :str = Field(...)
    price: float
    availability: int
