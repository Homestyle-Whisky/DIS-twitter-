from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# 👇 THIS is the correct CORS config (broad but guaranteed to work for localhost dev)
CORS(app, supports_credentials=True)

# Supabase setup
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

@app.route("/")
def home():
    return "Backend is running!"

@app.route("/create_account", methods=["POST"])
def create_account():
    data = request.get_json()
    email = data.get("email")
    full_name = data.get("full_name")
    password = data.get("password")

    if not all([email, full_name, password]):
        return jsonify({"error": "Missing fields"}), 400

    response = supabase.table("users").insert({
        "email": email,
        "full_name": full_name,
        "password": password
    }).execute()

    if response.status_code != 201:
        return jsonify({"error": response}), 500

    return jsonify({"message": "Account created successfully"}), 201

if __name__ == "__main__":
    app.run(debug=True)
