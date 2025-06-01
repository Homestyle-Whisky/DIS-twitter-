# Databaseconnection.py
import os
from supabase import create_client, Client, AuthApiError
from dotenv import load_dotenv

load_dotenv()
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

def user_signup(email: str, password: str, name: str):
    # 1) Sign up with GoTrue
    try:
        auth_resp = supabase.auth.sign_up({
            "email":    email,
            "password": password,
        })
    except AuthApiError as e:
        return str(e), None

    user = auth_resp.user
    if user is None:
        return "Please check your email for the confirmation link.", None

    # 2) Insert into your Postgres "users" table
    try:
        insert_resp = (
            supabase
            .table("users")
            .insert({
                "id":    user.id,
                "email": user.email,
                "username":  name,
                "password": password
            })
            .execute()
        )
    except Exception as e:
        # this will catch whatever the Postgrest client threw
        return str(e), None

    # 3) Check for logical errors (e.g. unique‐constraint violation surfaced in .error)
    if getattr(insert_resp, "error", None):
        return insert_resp.error.message, None

    # 4) Success
    return None, insert_resp.data[0]


def user_login(email,password): 
    credentials = {
        "email": email, 
        "password": password,
    }
    try:
        auth = supabase.auth.sign_in_with_password({
            "email":    email,
            "password": password,
        })
    except AuthApiError as e:
        return str(e), None
    
    session = auth.session
    user    = auth.user
    if session is None or user is None:
        return "Invalid email or password.", None
    
    return None, {
        "session": {
            "access_token":  session.access_token,
            "refresh_token": session.refresh_token,
            "expires_at":    session.expires_at,
            # add any other primitive fields you need
        },
        "user": {
            "id":    user.id,
            "email": user.email,
            # user.user_metadata or similar if you stored extra metadata
        }
    }


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