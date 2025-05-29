# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client
from dotenv import load_dotenv
from Databaseconnection import user_signup
import os
load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(url, key)


app = Flask(__name__)
# Allow all origins / methods / headers
CORS(
   app,
    resources={r"/*": {"origins": "*"}},
    supports_credentials=True,
    intercept_exceptions=True    # ← now even uncaught exceptions get CORS headers
 )

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"]  = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return response

@app.route("/signup", methods=["POST"])
def signup_route():
    data = request.get_json(force=True)
    if not data:
        return jsonify({"error": "Invalid JSON body"}), 400

    result = user_signup(
        email=data.get("email"),
        password=data.get("password"),
        name=data.get("name"),
    )

    # If our helper returned an error key, bubble it up
    if "error" in result:
        return jsonify(result), 400

    return jsonify(result), 201

@app.errorhandler(Exception)
def handle_all_exceptions(e):
    # Build a JSON response instead of the HTML debug page
    resp = jsonify({
        "error":   "Internal server error",
        "details": str(e)
    })
    resp.status_code = 500

    # Force the same CORS headers
    resp.headers["Access-Control-Allow-Origin"]  = "*"
    resp.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return resp


@app.route("/start_game", methods=["POST"])
def start_game():
    response = supabase.table("games").insert({
        "user_id": "f33d2948-6aef-4b67-a2d5-ed9968f3a0d5",
        "score": 0
    }).execute()

    game_id = response.data[0]["game_id"]
    return jsonify({"game_id": game_id})



if __name__ == "__main__":
    # host="0.0.0.0" lets other machines on the LAN (or your Live-Server) reach it
    app.run(debug=True, host="0.0.0.0", port=5000)
