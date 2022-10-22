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
                "title": "Test Event",
                "details": "blocks",
                "start_dt": "2022-10-11T12:55",
                "end_dt": "2022-11-11T03:55",
                "category":["Movies"],
                "price": "15",
                "user_postcode":"2122",
                "distance":"50",
                "location": "Mars"
            }
        }

