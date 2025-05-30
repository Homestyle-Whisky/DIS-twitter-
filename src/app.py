from flask import Flask, request, jsonify
from supabase import create_client

#  Supabase konfiguration
app = Flask(__name__)
url = "https://gkkyhepijeaykkpukelb.supabase.co"  # <- din project URL
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdra3loZXBpamVheWtrcHVrZWxiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzkwMzYwMiwiZXhwIjoyMDYzNDc5NjAyfQ.7vXzFlMDvqDLLWf2XA-jaz7KhLlN3jrH1Sd-EMe27n8"                  # <- fra Supabase API settings

# Din funktion der indsætter et gæt
def submit_guess(user_id, tweet_id, user_answer, correct_answer):
    response = supabase.table("guesses").insert({
        "user_id": user_id,
        "tweet_id": tweet_id,
        "user_answer": user_answer,
        "correct_answer": correct_answer
    }).execute()
    print("✅ Gæt gemt!")

# Flask route der modtager gættet
@app.route("/submit_guess", methods=["POST"])
def handle_guess():
    data = request.get_json()
    submit_guess(
        user_id=data["user_id"],
        tweet_id=data["tweet_id"],
        user_answer=data["user_answer"],
        correct_answer=data["correct_answer"]
    )
    return jsonify({"status": "ok"})

# Starter Flask-serveren
if __name__ == "__main__":
    app.run(debug=True)




# # 🔁 Test-kald
# if __name__ == "__main__":
#     # 🔧 INDSÆT RIGTIGE VÆRDIER HER:
#     user_id = "075db9a5-1b1f-40ed-aa07-e5f37ccedc5c"  # UUID fra din users-tabel
#     tweet_id = 42
#     user_answer = False
#     correct_answer = False








# from flask import Flask, request, jsonify
# from supabase import create_client
# from flask_cors import CORS  # hvis du loader siden fra en anden host

# app = Flask(__name__)
# CORS(app)  # valgfrit: gør det muligt at kalde fra browseren

# # Supabase konfiguration
# url = "https://gkkyhepijeaykkpukelb.supabase.co"
# key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdra3loZXBpamVheWtrcHVrZWxiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzkwMzYwMiwiZXhwIjoyMDYzNDc5NjAyfQ.7vXzFlMDvqDLLWf2XA-jaz7KhLlN3jrH1Sd-EMe27n8"  # Brug SERVICE ROLE KEY!
# supabase = create_client(url, key)

# # Route til at modtage gæt
# @app.route("/submit_guess", methods=["POST"]) # browser eller javascript skal sende data til stien "/submit_guess"
# def submit_guess():
#     data = request.get_json()

#     user_id = data.get("user_id")
#     tweet_id = data.get("tweet_id")
#     user_answer = data.get("user_answer")
#     correct_answer = data.get("correct_answer")

#     # Indsæt gæt i databasen
#     response = supabase.table("guesses").insert({
#         "user_id": user_id,
#         "tweet_id": tweet_id,
#         "user_answer": user_answer,
#         "correct_answer": correct_answer
#     }).execute()

#     if response.error:
#         return jsonify({"status": "error", "message": str(response.error)}), 400

#     return jsonify({"status": "success"}), 200

# # Start server
# if __name__ == "__main__":
#     app.run(debug=True)
