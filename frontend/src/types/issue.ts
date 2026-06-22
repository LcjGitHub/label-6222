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
  tags: Tag[];
  created_at?: string;
  updated_at?: string;
}

/** 创建/更新期号时的请求体 */
export type IssueInput = Omit<Issue, "id" | "created_at" | "updated_at" | "tags"> & {
  tag_ids: number[];
};
