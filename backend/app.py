"""独立杂志封面字体研究 — Flask API 服务。"""

from flask import Flask, jsonify, request
from flask_cors import CORS

from database import get_connection, init_db
from seed import seed

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

REQUIRED_FIELDS = (
    "magazine_name",
    "issue_number",
    "year",
    "font_description",
    "designer",
)


def row_to_dict(row) -> dict:
    """将 sqlite3.Row 转为 JSON 可序列化字典。"""
    return dict(row)


def validate_payload(data: dict, partial: bool = False) -> tuple[dict | None, str | None]:
    """
     * 校验请求体字段。
     * @param {dict} data
     * @param {bool} partial - 是否为 PATCH/PUT 部分更新
     * @returns {[dict | None, str | None]}
     """
    if not data:
        return None, "请求体不能为空"

    errors = []
    for field in REQUIRED_FIELDS:
        if field not in data and not partial:
            errors.append(f"缺少必填字段: {field}")
        elif field in data:
            if field == "year":
                try:
                    data[field] = int(data[field])
                except (TypeError, ValueError):
                    errors.append("year 必须为整数")
            elif not str(data[field]).strip():
                errors.append(f"{field} 不能为空")

    if errors:
        return None, "; ".join(errors)

    return data, None


@app.route("/api/health", methods=["GET"])
def health():
    """健康检查。"""
    return jsonify({"status": "ok"})


@app.route("/api/issues", methods=["GET"])
def list_issues():
    """获取全部期号列表。"""
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT * FROM issues ORDER BY year DESC, id DESC"
        ).fetchall()
    return jsonify([row_to_dict(r) for r in rows])


@app.route("/api/issues/<int:issue_id>", methods=["GET"])
def get_issue(issue_id: int):
    """获取单条期号详情。"""
    with get_connection() as conn:
        row = conn.execute(
            "SELECT * FROM issues WHERE id = ?", (issue_id,)
        ).fetchone()
    if row is None:
        return jsonify({"error": "未找到该期号"}), 404
    return jsonify(row_to_dict(row))


@app.route("/api/issues", methods=["POST"])
def create_issue():
    """创建新期号。"""
    data, err = validate_payload(request.get_json(silent=True) or {})
    if err:
        return jsonify({"error": err}), 400

    link = (data.get("link") or "").strip() or None

    with get_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO issues
                (magazine_name, issue_number, year, font_description, designer, link)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                data["magazine_name"].strip(),
                data["issue_number"].strip(),
                data["year"],
                data["font_description"].strip(),
                data["designer"].strip(),
                link,
            ),
        )
        conn.commit()
        row = conn.execute(
            "SELECT * FROM issues WHERE id = ?", (cursor.lastrowid,)
        ).fetchone()

    return jsonify(row_to_dict(row)), 201


@app.route("/api/issues/<int:issue_id>", methods=["PUT"])
def update_issue(issue_id: int):
    """更新期号信息。"""
    data, err = validate_payload(request.get_json(silent=True) or {}, partial=True)
    if err:
        return jsonify({"error": err}), 400

    with get_connection() as conn:
        existing = conn.execute(
            "SELECT * FROM issues WHERE id = ?", (issue_id,)
        ).fetchone()
        if existing is None:
            return jsonify({"error": "未找到该期号"}), 404

        merged = dict(existing)
        merged.update(data)
        if "link" in data:
            merged["link"] = (data.get("link") or "").strip() or None

        conn.execute(
            """
            UPDATE issues SET
                magazine_name = ?,
                issue_number = ?,
                year = ?,
                font_description = ?,
                designer = ?,
                link = ?,
                updated_at = datetime('now')
            WHERE id = ?
            """,
            (
                str(merged["magazine_name"]).strip(),
                str(merged["issue_number"]).strip(),
                int(merged["year"]),
                str(merged["font_description"]).strip(),
                str(merged["designer"]).strip(),
                merged.get("link"),
                issue_id,
            ),
        )
        conn.commit()
        row = conn.execute(
            "SELECT * FROM issues WHERE id = ?", (issue_id,)
        ).fetchone()

    return jsonify(row_to_dict(row))


@app.route("/api/issues/<int:issue_id>", methods=["DELETE"])
def delete_issue(issue_id: int):
    """删除期号。"""
    with get_connection() as conn:
        cursor = conn.execute("DELETE FROM issues WHERE id = ?", (issue_id,))
        conn.commit()
        if cursor.rowcount == 0:
            return jsonify({"error": "未找到该期号"}), 404
    return jsonify({"message": "已删除"}), 200


if __name__ == "__main__":
    init_db()
    seed()
    app.run(host="0.0.0.0", port=4000, debug=True)
