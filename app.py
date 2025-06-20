# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from supabase import create_client, AuthApiError
import re 
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

@app.route("/")
def home():
    return {"message": "Backend is running successfully!"}


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"]  = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return response

@app.route("/signup", methods=["POST"])
def signup():
    payload = request.get_json(force=True)

    email  = payload.get("email")
    
    pattern = r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(com|org|net|edu|io|gov)$"

    if not re.match(pattern,email): 
        return jsonify({"error": "please enter valid email"}), 400 
    
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

    email  = data.get("email")
    
    pattern = r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(com|org|net|edu|io|gov)$"

    if not re.match(pattern,email): 
        return jsonify({"error": "please enter valid email"}), 400 

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

@app.route("/submit_score", methods=["POST"])
def submit_score():
    user_id = request.form["user_id"]
    game_id = request.form["game_id"]
    score = request.form["score"]

    print("✅ Score indsendt!")
    print("user_id:", user_id)
    print("game_id:", game_id)
    print("score:", score)

    response = supabase.table("games").update({
        "score": int(score)
    }).eq("game_id", game_id).eq("user_id", user_id).execute()

    print("🧾 Supabase response:", response)

    return "Score submitted successfully"

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)