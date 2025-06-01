# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from supabase import create_client, AuthApiError


from Databaseconnection import user_signup, user_login, supabase

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


if __name__ == "__main__":
    # host="0.0.0.0" lets other machines on the LAN (or your Live-Server) reach it
    app.run(debug=True, host="0.0.0.0", port=5000)
