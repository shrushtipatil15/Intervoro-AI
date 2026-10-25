from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")

client = MongoClient(MONGO_URI)

db = client[DATABASE_NAME]

users_collection = db["users"]
interviews_collection = db["interviews"]
answers_collection = db["answers"]
reports_collection = db["reports"]