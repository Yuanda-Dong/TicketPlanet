import uuid
from typing import Optional, Union
from enum import Enum
from pydantic import BaseModel, Field, validator, ValidationError
from util.oAuth import oauth2_scheme


class GenderEnum(str, Enum):
    male = 'male'
    female = 'female'
    nonbinary = 'nonbinary'

class AgeEnum(str, Enum):
    age_group1 = '<=14'
    age_group2 = '15-25'
    age_group3 = '26-35'
    age_group4 = '36-50'
    age_group5 = '>50'


class User(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    email:str = Field(...)
    first_name:str = Field(...)
    last_name:str = Field(...)
    gender: GenderEnum = Field(...)
    postcode: int = Field(...)
    disabled: Union[bool, None] = None
    age: AgeEnum = Field(...)
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
                "_id": "123456",
                "email": "Don.Quixote@gmail.com",
                "first_name": "Don",
                "last_name" : "Quixote",
                "gender": "nonbinary",
                "postcode": "2000",
                "disabled:": "true",
                "age": "15-25"
            }
        }
        
class UserInDB(User):
    password: str = Field(...)
    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "email": "Don.Quixote@gmail.com",
                "first_name": "Don",
                "last_name" : "Quixote",
                "gender": "nonbinary",
                "postcode": "2000",
                "disabled:": "true",
                "password": "password",
                "age": "15-25"
            }
        }

class UserUpdate(BaseModel):
    id: Optional[str]
    first_name:str = Optional[str]
    last_name:str = Optional[str]
    email: Optional[str]
    gender: Optional[GenderEnum]
    postcode: Optional[int]
    age: Optional[AgeEnum]
    
    @validator('postcode')
    def postcode_must_be_4_digts(cls, v):
        if len(str(v)) != 4:
            raise ValueError('Postcode must be 4 digits')
        return v

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "email": "Don.Quixote@gmail.com",
                "first_name": "Don",
                "last_name" : "Quixote",
                "gender": "nonbinary",
                "postcode": "2000",
                "age": "15-25"
            }
        }


class ForgetPassword(BaseModel):
    email: Optional[str]

class ResetPassword(BaseModel):
    reset_password_token: Optional[str]
    new_password: str
    confirm_password: str