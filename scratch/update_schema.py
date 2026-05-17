import sqlite3
import os

db_path = "sentinel.db"
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check existing columns
    cursor.execute("PRAGMA table_info(products)")
    columns = [row[1] for row in cursor.fetchall()]
    
    new_columns = [
        ("status", "TEXT"),
        ("severity", "TEXT"),
        ("total_reviews", "INTEGER"),
        ("flagged_reviews", "INTEGER"),
        ("flags_json", "TEXT"),
        ("ratings_json", "TEXT"),
        ("reasons_json", "TEXT")
    ]
    
    for col_name, col_type in new_columns:
        if col_name not in columns:
            print(f"Adding column {col_name} to products table...")
            cursor.execute(f"ALTER TABLE products ADD COLUMN {col_name} {col_type}")
    
    conn.commit()
    conn.close()
    print("Schema update complete.")
else:
    print("DB file not found, SQLAlchemy will create it with new schema.")
