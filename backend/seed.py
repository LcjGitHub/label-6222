"""种子数据：5 条独立杂志封面字体研究样本及预设标签。"""

from database import get_connection, init_db

PRESET_TAGS = [
    "无衬线",
    "衬线",
    "手写",
    "等宽",
    "展示体",
]

SEED_DATA = [
    {
        "magazine_name": "Brilliant",
        "issue_number": "Vol.12",
        "year": 2023,
        "font_description": "封面主标题采用定制无衬线体，字重极细，字距加宽，呈现北欧极简气质。副标题使用 Grotesk 变体。",
        "designer": "Studio Temp",
        "link": "https://example.com/brilliant-12",
        "cover_image": "https://picsum.photos/seed/brilliant-magazine/600/800",
        "tag_names": ["无衬线"],
    },
    {
        "magazine_name": "Cereal",
        "issue_number": "Issue 21",
        "year": 2022,
        "font_description": "封面使用 Didot 风格高对比衬线体，大写排版，行距紧凑，强调编辑类杂志的典雅感。",
        "designer": "Rosa Park",
        "link": "https://example.com/cereal-21",
        "cover_image": "https://picsum.photos/seed/cereal-magazine/600/800",
        "tag_names": ["衬线", "展示体"],
    },
    {
        "magazine_name": "Apartamento",
        "issue_number": "Issue 32",
        "year": 2024,
        "font_description": "手写风格 Display 字体与 Helvetica Neue 混排，封面标题倾斜放置，营造居家生活杂志的随性感。",
        "designer": "Apartamento Studio",
        "link": "https://example.com/apartamento-32",
        "cover_image": "https://picsum.photos/seed/apartamento-magazine/600/800",
        "tag_names": ["手写", "无衬线", "展示体"],
    },
    {
        "magazine_name": "Kinfolk",
        "issue_number": "Volume 48",
        "year": 2023,
        "font_description": "封面采用 Caslon 衍生衬线体，小字号全大写，留白比例极高，字体与摄影形成呼吸感。",
        "designer": "John Doe Office",
        "link": "https://example.com/kinfolk-48",
        "cover_image": "https://picsum.photos/seed/kinfolk-magazine/600/800",
        "tag_names": ["衬线"],
    },
    {
        "magazine_name": "Monocle",
        "issue_number": "Issue 156",
        "year": 2024,
        "font_description": "封面使用 Monocle 专属 Sans 字体，几何感强，红色块与白色字形成品牌识别，期号以等宽数字呈现。",
        "designer": "Tyler Brûlé",
        "link": "https://example.com/monocle-156",
        "cover_image": "https://picsum.photos/seed/monocle-magazine/600/800",
        "tag_names": ["无衬线", "等宽"],
    },
]


def seed_tags(conn) -> None:
    """写入预设标签（仅在 tags 表为空时插入）。"""
    count = conn.execute("SELECT COUNT(*) FROM tags").fetchone()[0]
    if count > 0:
        return
    for name in PRESET_TAGS:
        conn.execute("INSERT INTO tags (name) VALUES (?)", (name,))
    conn.commit()
    print(f"已插入 {len(PRESET_TAGS)} 条预设标签。")


def migrate_issue_tags(conn) -> None:
    """迁移：已有期号但 issue_tags 为空时，为五条初始期号写入标签绑定。"""
    issue_count = conn.execute("SELECT COUNT(*) FROM issues").fetchone()[0]
    tag_count = conn.execute("SELECT COUNT(*) FROM issue_tags").fetchone()[0]

    if issue_count == 0 or tag_count > 0:
        return

    print("检测到已有期号但无标签绑定，正在迁移标签数据…")

    tag_map = {
        row["name"]: row["id"] for row in conn.execute("SELECT * FROM tags").fetchall()
    }

    issues = conn.execute(
        "SELECT * FROM issues ORDER BY id ASC LIMIT ?", (len(SEED_DATA),)
    ).fetchall()

    bound_count = 0
    for issue, seed_item in zip(issues, SEED_DATA):
        tag_names = seed_item.get("tag_names", [])
        for name in tag_names:
            tag_id = tag_map.get(name)
            if tag_id:
                conn.execute(
                    "INSERT OR IGNORE INTO issue_tags (issue_id, tag_id) VALUES (?, ?)",
                    (issue["id"], tag_id),
                )
                bound_count += 1

    conn.commit()
    print(f"已为 {len(issues)} 条期号绑定 {bound_count} 个标签。")


def migrate_issue_cover_images(conn) -> None:
    """迁移：已有五条初始期号但封面链接为空时，按种子数据补写封面链接。"""
    issue_count = conn.execute("SELECT COUNT(*) FROM issues").fetchone()[0]
    if issue_count < len(SEED_DATA):
        return

    cursor = conn.execute("PRAGMA table_info(issues)")
    columns = [row[1] for row in cursor.fetchall()]
    if "cover_image" not in columns:
        return

    issues = conn.execute(
        "SELECT * FROM issues ORDER BY id ASC LIMIT ?", (len(SEED_DATA),)
    ).fetchall()

    needs_migration = False
    for issue, seed_item in zip(issues, SEED_DATA):
        if not issue["cover_image"] and seed_item.get("cover_image"):
            needs_migration = True
            break

    if not needs_migration:
        return

    print("检测到已有期号但封面链接为空，正在迁移封面图片数据…")

    updated_count = 0
    for issue, seed_item in zip(issues, SEED_DATA):
        cover_image = seed_item.get("cover_image")
        if not issue["cover_image"] and cover_image:
            conn.execute(
                "UPDATE issues SET cover_image = ?, updated_at = datetime('now') WHERE id = ?",
                (cover_image, issue["id"]),
            )
            updated_count += 1

    conn.commit()
    print(f"已为 {updated_count} 条期号补写封面链接。")


def seed() -> None:
    """写入种子数据（仅在 issues 表为空时插入），并在需要时迁移标签和封面图片。"""
    init_db()
    with get_connection() as conn:
        seed_tags(conn)

        count = conn.execute("SELECT COUNT(*) FROM issues").fetchone()[0]
        if count > 0:
            print(f"数据库已有 {count} 条期号记录。")
            migrate_issue_tags(conn)
            migrate_issue_cover_images(conn)
            return

        tag_map = {
            row["name"]: row["id"] for row in conn.execute("SELECT * FROM tags").fetchall()
        }

        for item in SEED_DATA:
            tag_names = item.pop("tag_names", [])
            cursor = conn.execute(
                """
                INSERT INTO issues
                    (magazine_name, issue_number, year, font_description, designer, link, cover_image)
                VALUES
                    (:magazine_name, :issue_number, :year, :font_description, :designer, :link, :cover_image)
                """,
                item,
            )
            issue_id = cursor.lastrowid

            for name in tag_names:
                tag_id = tag_map.get(name)
                if tag_id:
                    conn.execute(
                        "INSERT INTO issue_tags (issue_id, tag_id) VALUES (?, ?)",
                        (issue_id, tag_id),
                    )

        conn.commit()
        print(f"已插入 {len(SEED_DATA)} 条种子数据。")


if __name__ == "__main__":
    seed()
