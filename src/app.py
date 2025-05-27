from flask import Flask, request, jsonify
from supabase import create_client
from flask_cors import CORS  # hvis du loader siden fra en anden host

app = Flask(__name__)
CORS(app)  # valgfrit: gør det muligt at kalde fra browseren

# Supabase konfiguration
url = "https://gkkyhepijeaykkpukelb.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdra3loZXBpamVheWtrcHVrZWxiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzkwMzYwMiwiZXhwIjoyMDYzNDc5NjAyfQ.7vXzFlMDvqDLLWf2XA-jaz7KhLlN3jrH1Sd-EMe27n8"  # Brug SERVICE ROLE KEY!
supabase = create_client(url, key)

# Route til at modtage gæt
@app.route("/submit_guess", methods=["POST"]) # browser eller javascript skal sende data til stien "/submit_guess"
def submit_guess():
    data = request.get_json()

    user_id = data.get("user_id")
    tweet_id = data.get("tweet_id")
    user_answer = data.get("user_answer")
    correct_answer = data.get("correct_answer")

    # Indsæt gæt i databasen
    response = supabase.table("guesses").insert({
        "user_id": user_id,
        "tweet_id": tweet_id,
        "user_answer": user_answer,
        "correct_answer": correct_answer
    }).execute()

    if response.error:
        return jsonify({"status": "error", "message": str(response.error)}), 400

    return jsonify({"status": "success"}), 200

# Start server
if __name__ == "__main__":
    app.run(debug=True)
