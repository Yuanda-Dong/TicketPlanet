# from datetime import datetime
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class Filter(BaseModel):
    title: Optional[str]
    details: Optional[str]
    start_dt: Optional[datetime]
    end_dt: Optional[datetime]
    #reply_preview: str #first 50 characters
    category: Optional[List[str]]
    price: Optional[float]
    user_postcode: Optional[str]
    distance: Optional[str]
    location: Optional[str]


    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "ticket_name": "General Admission",
                "price": "15",
                "availability":"55"
            }
        }

