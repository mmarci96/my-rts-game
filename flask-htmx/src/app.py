from logging import log
from flask import Flask
from flask_pymongo import PyMongo
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
print(os.getenv("MONGO_URI"))
# Get the Mongo URI from the .env file
app.config["MONGO_URI"] = os.getenv("MONGO_URI")

# Initialize PyMongo
mongo = PyMongo(app)

@app.route("/")
def home():
    return "MongoDB connected successfully!" if mongo else "MongoDB connection failed."

if __name__ == "__main__":
    app.run(debug=True)

