import axios from "axios";
import type { Issue, IssueInput, Tag, DesignerSummary } from "@/types/issue";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

/**
 * 获取全部标签列表。
 */
export async function fetchTags(): Promise<Tag[]> {
  const { data } = await api.get<Tag[]>("/tags");
  return data;
}

export interface FetchIssuesParams {
  search?: string;
  year?: number | string;
  designer?: string;
}

/**
 * 获取全部期号列表，支持搜索和筛选。
 */
export async function fetchIssues(params?: FetchIssuesParams): Promise<Issue[]> {
  const queryParams: Record<string, string | number> = {};
  if (params?.search) {
    queryParams.search = params.search;
  }
  if (params?.year) {
    queryParams.year = params.year;
  }
  if (params?.designer) {
    queryParams.designer = params.designer;
  }
  const { data } = await api.get<Issue[]>("/issues", { params: queryParams });
  return data;
}

/**
 * 获取所有已收录的年份列表。
 */
export async function fetchIssueYears(): Promise<number[]> {
  const { data } = await api.get<number[]>("/issues/years");
  return data;
}

/**
 * 获取单条期号详情。
 * @param id - 期号 ID
 */
export async function fetchIssue(id: number): Promise<Issue> {
  const { data } = await api.get<Issue>(`/issues/${id}`);
  return data;
}

/**
 * 创建新期号。
 * @param input - 期号字段（含 tag_ids）
 */
export async function createIssue(input: IssueInput): Promise<Issue> {
  const { data } = await api.post<Issue>("/issues", input);
  return data;
}

/**
 * 更新期号。
 * @param id - 期号 ID
 * @param input - 部分或全部字段（可含 tag_ids）
 */
export async function updateIssue(
  id: number,
  input: Partial<IssueInput>
): Promise<Issue> {
  const { data } = await api.put<Issue>(`/issues/${id}`, input);
  return data;
}

/**
 * 删除期号。
 * @param id - 期号 ID
 */
export async function deleteIssue(id: number): Promise<void> {
  await api.delete(`/issues/${id}`);
}

export async function fetchDesignerSummary(): Promise<DesignerSummary[]> {
  const { data } = await api.get<DesignerSummary[]>("/designers/summary");
  return data;
}
