from fastapi import FastAPI
import os
from pymongo import MongoClient
from starlette.middleware.sessions import SessionMiddleware

app = FastAPI()
app.mongodb_client = MongoClient(os.getenv("MONGO_URL"))  # Product code
# app.mongodb_client = MongoClient("mongodb://mongo:XtbEzn8Wlulrhw6kzHAb@containers-us-west-89.railway.app:6864/")  # Test code
app.database = app.mongodb_client['test']
app.add_middleware(SessionMiddleware, secret_key=os.getenv("TOKEN_SECRET"))