from pydantic import BaseModel
from typing import List
class Report(BaseModel):
    gender:dict
    age: dict
    post: dict