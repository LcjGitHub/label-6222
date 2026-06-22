import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
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

  const { data: issues = [], isLoading, error } = useQuery({
    queryKey: ["issues"],
    queryFn: fetchIssues,
  });

  const createMutation = useMutation({
    mutationFn: createIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
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
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          <Plus className="h-4 w-4" />
          新增期号
        </Button>
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
        <p className="text-center text-muted-foreground">暂无数据，点击上方按钮新增。</p>
      )}

      <ul className="grid gap-4">
        {issues.map((issue) => (
          <li key={issue.id}>
            <Card className="transition-shadow hover:shadow-md">
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
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
