# from datetime import datetime
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class Filter(BaseModel):
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    #reply_preview: str #first 50 characters
    category: Optional[List[str]]
    start_price: Optional[float]
    end_price: Optional[float]
    city: Optional[str]

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "ticket_name": "General Admission",
                "price": "15",
                "availability":"55"
            }
        }

