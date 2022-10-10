from fastapi import FastAPI
import os
from pymongo import MongoClient
app = FastAPI()
app.mongodb_client = MongoClient(os.getenv("MONGO_URL"))
app.database = app.mongodb_client['test']