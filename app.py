# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS

from Databaseconnection import user_signup

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

if __name__ == "__main__":
    # host="0.0.0.0" lets other machines on the LAN (or your Live-Server) reach it
    app.run(debug=True, host="0.0.0.0", port=5000)
