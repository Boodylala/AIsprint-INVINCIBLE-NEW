import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

URL = os.getenv("SUPABASE_URL")
KEY = os.getenv("SUPABASE_KEY")

def get_supabase_client() -> Client:
    if not URL or not KEY:
        raise ValueError("Supabase URL or Key is missing from environment variables.")
    return create_client(URL, KEY)

def save_brief(brief_data: str):
    supabase = get_supabase_client()
    # Assuming 'briefs' table has 'id' (auto UUID) and 'content' (text/json)
    response = supabase.table("briefs").insert({"content": brief_data}).execute()
    return response.data[0]['id']

def fetch_brief(brief_id: str):
    supabase = get_supabase_client()
    response = supabase.table("briefs").select("*").eq("id", brief_id).execute()
    if len(response.data) > 0:
        return response.data[0]
    return None

def confirm_brief_in_db(brief_id: str):
    """Updates the confirmed status of a brief to True in Supabase."""
    try:
        # Assuming your Supabase client is initialized as 'supabase'
        response = supabase.table("briefs").update({"confirmed": True}).eq("id", brief_id).execute()
        return response
    except Exception as e:
        print(f"Database error: {e}")
        raise e
