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


# valid stripe IPs found here: https://stripe.com/docs/ips

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:8000",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://3.18.12.63",
    "http://3.130.192.231",
    "http://13.235.14.237",
    "http://13.235.122.149",
    "http://18.211.135.69",
    "http://35.154.171.200",
    "http://52.15.183.38",
    "http://54.88.130.119",
    "http://54.88.130.237",
    "http://54.187.174.169",
    "http://54.187.205.235",
    "http://54.187.216.72"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
