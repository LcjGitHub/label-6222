# 独立杂志封面字体研究

MVP 全栈应用：收录独立杂志封面字体分析，支持期号列表与详情查看、基础 CRUD。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React + shadcn/ui · TanStack Query + axios · 端口 **4101** |
| 后端 | Flask + SQLite `./data/magazine.db` · 端口 **4000** |

## 数据字段

- 杂志名 (`magazine_name`)
- 期号 (`issue_number`)
- 年份 (`year`)
- 字体描述 (`font_description`)
- 设计师 (`designer`)
- 链接 (`link`)

## 快速启动

### 1. 后端（一条命令）

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS / Linux
pip install -r requirements.txt
python app.py
```

启动后自动初始化数据库并写入 **5 条** seed 数据。API 地址：`http://localhost:4000`

### 2. 前端

另开终端：

```bash
cd frontend
npm install
npm run dev
```

浏览器访问：`http://localhost:4101`

> 依赖均在项目目录内安装（`backend/.venv`、`frontend/node_modules`），无需全局 pnpm/yarn。

## API 概览

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/issues` | 期号列表 |
| GET | `/api/issues/:id` | 期号详情 |
| POST | `/api/issues` | 新建 |
| PUT | `/api/issues/:id` | 更新 |
| DELETE | `/api/issues/:id` | 删除 |
| GET | `/api/health` | 健康检查 |

## 目录结构

```
├── backend/
│   ├── app.py          # Flask 入口 + CRUD
│   ├── database.py     # SQLite 连接
│   ├── seed.py         # 5 条种子数据
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── api/        # axios 请求
│       ├── components/ # UI 组件 + IssueDetailCard
│       └── pages/      # 列表页 + 详情页
├── data/               # magazine.db（运行时生成）
└── README.md
```

## 页面

1. **列表页** `/` — 全部期号卡片，支持新增、删除、跳转详情
2. **详情页** `/issues/:id` — 封面字体分析 Card，支持编辑、删除
