"""种子数据：5 条独立杂志封面字体研究样本。"""

from database import get_connection, init_db

SEED_DATA = [
    {
        "magazine_name": "Brilliant",
        "issue_number": "Vol.12",
        "year": 2023,
        "font_description": "封面主标题采用定制无衬线体，字重极细，字距加宽，呈现北欧极简气质。副标题使用 Grotesk 变体。",
        "designer": "Studio Temp",
        "link": "https://example.com/brilliant-12",
    },
    {
        "magazine_name": "Cereal",
        "issue_number": "Issue 21",
        "year": 2022,
        "font_description": "封面使用 Didot 风格高对比衬线体，大写排版，行距紧凑，强调编辑类杂志的典雅感。",
        "designer": "Rosa Park",
        "link": "https://example.com/cereal-21",
    },
    {
        "magazine_name": "Apartamento",
        "issue_number": "Issue 32",
        "year": 2024,
        "font_description": "手写风格 Display 字体与 Helvetica Neue 混排，封面标题倾斜放置，营造居家生活杂志的随性感。",
        "designer": "Apartamento Studio",
        "link": "https://example.com/apartamento-32",
    },
    {
        "magazine_name": "Kinfolk",
        "issue_number": "Volume 48",
        "year": 2023,
        "font_description": "封面采用 Caslon 衍生衬线体，小字号全大写，留白比例极高，字体与摄影形成呼吸感。",
        "designer": "John Doe Office",
        "link": "https://example.com/kinfolk-48",
    },
    {
        "magazine_name": "Monocle",
        "issue_number": "Issue 156",
        "year": 2024,
        "font_description": "封面使用 Monocle 专属 Sans 字体，几何感强，红色块与白色字形成品牌识别，期号以等宽数字呈现。",
        "designer": "Tyler Brûlé",
        "link": "https://example.com/monocle-156",
    },
]


def seed() -> None:
    """写入种子数据（仅在表为空时插入）。"""
    init_db()
    with get_connection() as conn:
        count = conn.execute("SELECT COUNT(*) FROM issues").fetchone()[0]
        if count > 0:
            print(f"数据库已有 {count} 条记录，跳过 seed。")
            return

        for item in SEED_DATA:
            conn.execute(
                """
                INSERT INTO issues
                    (magazine_name, issue_number, year, font_description, designer, link)
                VALUES
                    (:magazine_name, :issue_number, :year, :font_description, :designer, :link)
                """,
                item,
            )
        conn.commit()
        print(f"已插入 {len(SEED_DATA)} 条种子数据。")


if __name__ == "__main__":
    seed()
