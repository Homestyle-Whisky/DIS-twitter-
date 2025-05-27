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

# def get_tweet_attributes(tweet_id: str): 
#     response = (supabase.table("tweet_data")
#                 .select("name", "tweet", "is_real", "image_url")
#                 .eq("Tweet_ID", tweet_id)
#                 .execute()
#         ) 
#     return response.data


# print(get_tweet_attributes("1"))

def tweet_username(tweet_id: str):
    response = (supabase.table("tweet_data")
                .select("name", "tweet", "is_real", "image_url")
                .eq("Tweet_ID", tweet_id)
                .execute()
    )
    tweet_username = response.data[0]["name"]
    tweet_username = f'@{tweet_username.lower().replace(" ", "")}'
    tweet_username = tweet_username.replace("'", "")

    return tweet_username

print(tweet_username("1"))
