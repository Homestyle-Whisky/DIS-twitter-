import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

response = (
    supabase.table("tweet_data")
    .select("*")
    .execute()
)

def user_signup(email:str , password: str, name: str): 
    
    credentials= {
        "email": email, 
        "password": password,
        "data":{ "name": name
            }
        }
    response = supabase.auth.sign_up(credentials) 
    print("user created", response.user)

    auth_resp = supabase.auth.sign_up(credentials)

    user_uuid = auth_resp.user.id

    insert_to_users = (supabase.table("users")
                       .insert({"username": name,
                                "password": password, 
                                "mail": email,
                                "id": user_uuid
                                })
                        .execute() 
                       )
    return response, insert_to_users

user_signup("jonasg300@gmail.com", "jonashahah", "batman123")


# def user_login(email,password): 




def get_tweet_attributes(tweet_id: str): 
    response = (supabase.table("tweet_data")
                .select("name", "tweet", "is_real", "image_url")
                .eq("Tweet_ID", tweet_id)
                .execute()
        ) 
    return response.data


print(get_tweet_attributes("1"))



    
# user_signup("jonasg300@gmail.com", "madsmadpakke", "batman")

