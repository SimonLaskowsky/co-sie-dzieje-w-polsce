import psycopg2
from psycopg2.extras import execute_values
import os

connection_string = "postgresql://neondb_owner:npg_RI5eXVAb1KoY@ep-mute-mouse-a2oj3bow-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"

# SQL to create the table with renamed columns
create_table_query = """
CREATE TABLE IF NOT EXISTS acts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    act_number TEXT,
    simple_title TEXT,
    content TEXT,
    refs TEXT[],
    texts TEXT[],
    item_type TEXT,
    announcement_date DATE,
    change_date DATE,
    promulgation TEXT,
    item_status TEXT,
    comments TEXT,
    keywords TEXT[],
    file TEXT
);
"""

try:
    # Connect to Neon DB using the connection string
    conn = psycopg2.connect(connection_string)
    cursor = conn.cursor()

    # Create the table
    cursor.execute(create_table_query)
    conn.commit()
    print("Table 'items' created successfully.")

except Exception as e:
    print(f"Error: {e}")

finally:
    # Close the connection
    if cursor:
        cursor.close()
    if conn:
        conn.close()