# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from supabase import create_client, AuthApiError


from Databaseconnection import user_signup, user_login, supabase
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
def signup():
    payload = request.get_json(force=True)
    err, user = user_signup(
        payload.get("email"),
        payload.get("password"),
        payload.get("name")
    )

    if err:
        # 400 = client-side problem (bad data, duplicate, etc.)
        return jsonify({ "error": err }), 400

    # 201 = resource created successfully
    return jsonify(user), 201

@app.errorhandler(Exception)
def handle_all_exceptions(e):
    resp = jsonify({ "error": "Internal server error", "details": str(e) })
    resp.status_code = 500
    return resp

@app.route("/login", methods = ["POST"])
def login(): 
    data = request.get_json(force = True) or {}
    
    err, login_data= user_login(
         data.get("email"),
         data.get("password"),
    )
    if err:
        return jsonify({"error": err}), 401
    return jsonify(login_data), 200

@app.route("/start_game", methods=["POST"])
def start_game():
    data = request.get_json()  # Get the JSON data from the request
    user_id = data.get("user_id")  # Extract user_id from the request data

    response = supabase.table("games").insert({
        "user_id": user_id,  # Use the user_id from the request
        "score": 0
    }).execute()

    game_id = response.data[0]["game_id"]
    return jsonify({"game_id": game_id})



if __name__ == "__main__":
    # host="0.0.0.0" lets other machines on the LAN (or your Live-Server) reach it
    app.run(debug=True, host="0.0.0.0", port=5000)
