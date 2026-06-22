import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Users, ImageIcon } from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { createIssue, deleteIssue, fetchIssues } from "@/api/issues";
import { IssueForm } from "@/components/IssueForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * 期号列表页：展示全部杂志封面研究条目，支持新建与删除。
 */
export function IssueListPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const designerFilter = searchParams.get("designer") || "";

  const { data: issues = [], isLoading, error } = useQuery({
    queryKey: ["issues", designerFilter],
    queryFn: () => fetchIssues(designerFilter || undefined),
  });

  const createMutation = useMutation({
    mutationFn: createIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      queryClient.invalidateQueries({ queryKey: ["designers-summary"] });
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      queryClient.invalidateQueries({ queryKey: ["designers-summary"] });
    },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Typography Research
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            独立杂志封面字体研究
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            收录独立杂志封面字体分析，记录设计师、期号与字体特征描述。
          </p>
          {designerFilter && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                筛选设计师：
              </span>
              <Badge variant="secondary">{designerFilter}</Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchParams({})}
              >
                清除筛选
              </Button>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/designers">
              <Users className="h-4 w-4" />
              设计师汇总
            </Link>
          </Button>
          <Button onClick={() => setShowForm((v) => !v)}>
            <Plus className="h-4 w-4" />
            新增期号
          </Button>
        </div>
      </header>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>新增封面研究</CardTitle>
            <CardDescription>填写杂志期号与字体分析信息</CardDescription>
          </CardHeader>
          <CardContent>
            <IssueForm
              onSubmit={(data) => createMutation.mutate(data)}
              onCancel={() => setShowForm(false)}
              isSubmitting={createMutation.isPending}
            />
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <p className="text-center text-muted-foreground">加载中…</p>
      )}

      {error && (
        <p className="text-center text-destructive">
          加载失败，请确认后端服务已启动（端口 4000）。
        </p>
      )}

      {!isLoading && !error && issues.length === 0 && (
        <p className="text-center text-muted-foreground">
          {designerFilter
            ? "该设计师暂无收录期号，可点击清除筛选查看全部"
            : "暂无数据，点击上方按钮新增。"}
        </p>
      )}

      <ul className="grid gap-4">
        {issues.map((issue) => (
          <li key={issue.id}>
            <Card className="transition-shadow hover:shadow-md">
              <div className="flex">
                <div className="flex h-32 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-l-lg bg-muted">
                  {issue.cover_image ? (
                    <img
                      src={issue.cover_image}
                      alt={`${issue.magazine_name} 封面`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                        const placeholder = target.nextElementSibling as HTMLElement;
                        if (placeholder) placeholder.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`flex h-full w-full flex-col items-center justify-center gap-1 text-muted-foreground ${issue.cover_image ? "hidden" : ""}`}
                  >
                    <ImageIcon className="h-6 w-6" />
                    <span className="text-[10px]">无封面</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          to={`/issues/${issue.id}`}
                          className="hover:underline"
                        >
                          <CardTitle>{issue.magazine_name}</CardTitle>
                        </Link>
                        <CardDescription className="mt-2 flex flex-wrap gap-2">
                          <Badge variant="secondary">{issue.issue_number}</Badge>
                          <Badge variant="outline">{issue.year}</Badge>
                          <span className="text-sm">{issue.designer}</span>
                        </CardDescription>
                        {issue.tags && issue.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {issue.tags.map((tag) => (
                              <Badge key={tag.id} variant="default" className="text-[10px]">
                                {tag.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <Link to={`/issues/${issue.id}`}>查看详情</Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {issue.font_description}
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="mt-4"
                      onClick={() => {
                        if (window.confirm(`确定删除「${issue.magazine_name}」？`)) {
                          deleteMutation.mutate(issue.id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                    >
                      删除
                    </Button>
                  </CardContent>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
