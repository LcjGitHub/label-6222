"""SQLite 数据库初始化与连接管理。"""

import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "data" / "magazine.db"


def get_connection() -> sqlite3.Connection:
    """
     * 获取 SQLite 连接，启用 Row 工厂以便按列名访问。
     * @returns {sqlite3.Connection}
     """
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db() -> None:
    """创建 issues、tags、issue_tags 表（若不存在）。"""
    with get_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS issues (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                magazine_name TEXT NOT NULL,
                issue_number TEXT NOT NULL,
                year INTEGER NOT NULL,
                font_description TEXT NOT NULL,
                designer TEXT NOT NULL,
                link TEXT,
                cover_image TEXT,
                created_at TEXT DEFAULT (datetime('now')),
                updated_at TEXT DEFAULT (datetime('now'))
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS tags (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                created_at TEXT DEFAULT (datetime('now'))
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS issue_tags (
                issue_id INTEGER NOT NULL,
                tag_id INTEGER NOT NULL,
                PRIMARY KEY (issue_id, tag_id),
                FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE,
                FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
            )
            """
        )
        conn.commit()
        migrate_cover_image_column(conn)


def migrate_cover_image_column(conn: sqlite3.Connection) -> None:
    """迁移：若 issues 表缺少 cover_image 列，则自动添加。"""
    cursor = conn.execute("PRAGMA table_info(issues)")
    columns = [row[1] for row in cursor.fetchall()]
    if "cover_image" not in columns:
        print("检测到 issues 表缺少 cover_image 列，正在迁移…")
        conn.execute("ALTER TABLE issues ADD COLUMN cover_image TEXT")
        conn.commit()
        print("已为 issues 表添加 cover_image 列。")
