import psycopg2
from psycopg2.extras import execute_values
import os
import json
from typing import Dict, Any, Optional
from contextlib import contextmanager
from dotenv import load_dotenv

import requests
import random
import time

load_dotenv()

@contextmanager
def get_db_connection():

    connection_string = os.getenv("DATABASE_URL")
    if not connection_string:
        raise ValueError("DATABASE_URL is not set in environment variables")
    
    conn = None
    cursor = None
    try:
        conn = psycopg2.connect(connection_string)
        cursor = conn.cursor()
        yield conn, cursor
    except Exception as e:
        if conn:
            conn.rollback()
        raise
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

def save_to_database(filtered_item: Dict[str, Any]) -> bool:
    insert_query = """
    INSERT INTO acts (
        title, act_number, simple_title, content, refs, texts, item_type,
        announcement_date, change_date, promulgation, item_status, comments,
        keywords, file, votes
    ) VALUES %s
    """
    
    references = json.dumps(filtered_item.get("references")) if filtered_item.get("references") is not None else None
    texts = json.dumps(filtered_item.get("texts")) if filtered_item.get("texts") is not None else None
    votes = json.dumps(filtered_item.get("votes")) if filtered_item.get("votes") is not None else None
    
    data_tuple = (
        filtered_item.get("title"),
        filtered_item.get("actNumber"),
        filtered_item.get("simpleTitle"),
        filtered_item.get("content"),
        references,
        texts,
        filtered_item.get("type"),
        filtered_item.get("announcementDate"),
        filtered_item.get("changeDate"),
        filtered_item.get("promulgation"),
        filtered_item.get("status"),
        filtered_item.get("comments"),
        filtered_item.get("keywords"),
        filtered_item.get("file"),
        votes
    )
    
    try:
        with get_db_connection() as (conn, cursor):
            execute_values(cursor, insert_query, [data_tuple])
            conn.commit()
            print("Data saved successfully.")

            keywords = filtered_item.get("keywords", [])
            if isinstance(keywords, list):
                for kw in keywords:
                    if isinstance(kw, str) and kw.strip():
                        insert_keyword(kw.strip())

            return True
    except Exception as e:
        print(f"Error during data save: {e}")
        return False   

def insert_keyword(keyword: str) -> bool:
    insert_query = """
    INSERT INTO keywords (keyword)
    VALUES (%s)
    ON CONFLICT DO NOTHING
    """

    try:
        with get_db_connection() as (conn, cursor):
            cursor.execute(insert_query, (keyword,))
            conn.commit()
            print(f"Keyword '{keyword}' inserted.")
            return True
    except Exception as e:
        print(f"Error inserting keyword '{keyword}': {e}")
        return False
