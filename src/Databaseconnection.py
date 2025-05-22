import psycopg2
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

dsn = os.getenv("DATABASE_URL")            # ← now this will be your full URI

# Connect to the database

connection = psycopg2.connect(dsn, sslmode="require")

print("Connection successful!")
    
    # Create a cursor to execute SQL queries
cursor = connection.cursor()
    

cursor.execute("select tweet from tweet_data;")
rows = cursor.fetchall()

for i in rows: 
    print(i)

    # Close the cursor and connection
cursor.close()
connection.close()
print("Connection closed.")


