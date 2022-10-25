from fastapi import FastAPI
import os
from pymongo import MongoClient
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.mongodb_client = MongoClient(os.getenv("MONGO_URL"))  # Product code
# app.mongodb_client = MongoClient("mongodb://mongo:XtbEzn8Wlulrhw6kzHAb@containers-us-west-89.railway.app:6864/")  # Test code
app.database = app.mongodb_client['test']
app.add_middleware(SessionMiddleware, secret_key=os.getenv("TOKEN_SECRET"))

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:8000",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
