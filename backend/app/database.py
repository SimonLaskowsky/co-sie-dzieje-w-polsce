import psycopg2
from psycopg2.extras import execute_values
import os

def save_to_database(filtered_item):
    connection_string = os.getenv("NEON_CONNECTION_STRING")
    
    insert_query = """
    INSERT INTO acts (
        title, act_number, simple_title, content, refs, texts, item_type,
        announcement_date, change_date, promulgation, item_status, comments, keywords, file
    ) VALUES %s
    """
    
    try:
        conn = psycopg2.connect(connection_string)
        cursor = conn.cursor()
        execute_values(cursor, insert_query, [( 
            filtered_item["title"],
            filtered_item["actNumber"],
            filtered_item["simpleTitle"],
            filtered_item["content"],
            filtered_item["references"],
            filtered_item["texts"],
            filtered_item["type"],
            filtered_item["announcementDate"],
            filtered_item["changeDate"],
            filtered_item["promulgation"],
            filtered_item["status"],
            filtered_item["comments"],
            filtered_item["keywords"],
            filtered_item["file"]
        )])
        conn.commit()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
