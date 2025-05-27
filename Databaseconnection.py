# Databaseconnection.py
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

def user_signup(email: str, password: str, name: str) -> dict:
    # 1) Try to sign up the user in Auth; this will raise on error
    try:
        auth_resp = supabase.auth.sign_up({
            "email":    email,
            "password": password,
            "options":  {"data": {"username": name}},
        })
    except Exception as e:
        # turn any raised exception into a JSON-friendly error dict
        return {"error": str(e)}

    # 2) Pull the user object off the response
    user = getattr(auth_resp, "user", None)
    if not user or not getattr(user, "id", None):
        return {"error": "Sign-up succeeded but no user returned."}

    print(user)
    print(name)
    
    # 3) Persist to your own `users` table
    insert = (
        supabase
          .table("users")
          .insert({
            "id":    user.id,
            "mail": user.email,
            "username":  name,
            "password": password
          })
          .execute()    
    )

    # 4) Return the normal user payload
    return {
        "user": {
            "id":    user.id,
            "mail": user.email,
            "username":  name,
            "password": password
        }
    }

def user_login(email,password): 
    response = supabase.auth.sign_in_with_password(
    {
        "mail": email, 
        "password": password,
    }
    )
    return response 






def get_tweet_attributes(tweet_id: str): 
    response = (supabase.table("tweet_data")
                .select("name", "tweet", "is_real", "image_url")
                .eq("Tweet_ID", tweet_id)
                .execute()
        ) 
    return response.data

def update_userscore(id, score): 
    response = (supabase.table("users")
                .update({"score": score})
                .eq("id", id)
                .execute()
                )
    return response 


# user_signup("jonasg300@gmail.com", "madsmadpakke", "batman")
# update_userscore("075db9a5-1b1f-40ed-aa07-e5f37ccedc5c", 69)