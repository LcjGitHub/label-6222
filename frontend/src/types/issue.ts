/** 字体分类标签数据模型 */
export interface Tag {
  id: number;
  name: string;
  created_at?: string;
}

/** 杂志期号数据模型 */
export interface Issue {
  id: number;
  magazine_name: string;
  issue_number: string;
  year: number;
  font_description: string;
  designer: string;
  link: string | null;
  cover_image: string | null;
  tags: Tag[];
  created_at?: string;
  updated_at?: string;
}

/** 创建/更新期号时的请求体 */
export type IssueInput = Omit<Issue, "id" | "created_at" | "updated_at" | "tags"> & {
  tag_ids: number[];
};

/** 设计师汇总统计 */
export interface DesignerSummary {
  name: string;
  issue_count: number;
  latest_year: number;
}
