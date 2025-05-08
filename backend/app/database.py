import psycopg2
from psycopg2.extras import execute_values
import os
import json
from dotenv import load_dotenv

load_dotenv()

def save_to_database(filtered_item):
    """
    Zapisuje dane do tabeli 'acts' z poprawną serializacją JSON.
    """
    connection_string = os.getenv("DATABASE_URL")
    
    insert_query = """
    INSERT INTO acts (
        title, act_number, simple_title, content, refs, texts, item_type,
        announcement_date, change_date, promulgation, item_status, comments,
        keywords, file, votes
    ) VALUES %s
    """
    
    data_tuple = (
        filtered_item.get("title"),
        filtered_item.get("actNumber"),
        filtered_item.get("simpleTitle"),
        filtered_item.get("content"),
        json.dumps(filtered_item.get("references")) if filtered_item.get("references") is not None else None,
        json.dumps(filtered_item.get("texts")) if filtered_item.get("texts") is not None else None,
        filtered_item.get("type"),
        filtered_item.get("announcementDate"),
        filtered_item.get("changeDate"),
        filtered_item.get("promulgation"),
        filtered_item.get("status"),
        filtered_item.get("comments"),
        filtered_item.get("keywords"),
        filtered_item.get("file"),
        json.dumps(filtered_item.get("votes")) if filtered_item.get("votes") is not None else None,
    )
    
    try:
        conn = psycopg2.connect(connection_string)
        cursor = conn.cursor()
        execute_values(cursor, insert_query, [data_tuple])
        conn.commit()
        print("Data saved successfully.")
    except Exception as e:
        print(f"Error during data save: {e}")
        raise
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()