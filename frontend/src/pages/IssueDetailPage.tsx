import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteIssue, fetchIssue, updateIssue } from "@/api/issues";
import { IssueDetailCard } from "@/components/IssueDetailCard";
import { IssueForm } from "@/components/IssueForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * 期号详情页：展示封面字体分析 Card，支持编辑与删除。
 */
export function IssueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const issueId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);

  const { data: issue, isLoading, error } = useQuery({
    queryKey: ["issues", issueId],
    queryFn: () => fetchIssue(issueId),
    enabled: Number.isFinite(issueId),
  });

  const updateMutation = useMutation({
    mutationFn: (data: Parameters<typeof updateIssue>[1]) =>
      updateIssue(issueId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      queryClient.invalidateQueries({ queryKey: ["issues", issueId] });
      queryClient.invalidateQueries({ queryKey: ["designers-summary"] });
      setEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteIssue(issueId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      queryClient.invalidateQueries({ queryKey: ["designers-summary"] });
      navigate("/");
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center text-muted-foreground">
        加载中…
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
        <p className="text-destructive">未找到该期号或加载失败。</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link to="/">返回列表</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Button variant="ghost" size="sm" className="mb-6" asChild>
        <Link to="/">
          <ArrowLeft className="h-4 w-4" />
          返回列表
        </Link>
      </Button>

      {editing ? (
        <Card>
          <CardHeader>
            <CardTitle>编辑封面研究</CardTitle>
            <CardDescription>{issue.magazine_name}</CardDescription>
          </CardHeader>
          <CardContent>
            <IssueForm
              initial={issue}
              onSubmit={(data) => updateMutation.mutate(data)}
              onCancel={() => setEditing(false)}
              isSubmitting={updateMutation.isPending}
            />
          </CardContent>
        </Card>
      ) : (
        <IssueDetailCard
          issue={issue}
          onEdit={() => setEditing(true)}
          onDelete={() => {
            if (window.confirm(`确定删除「${issue.magazine_name}」？`)) {
              deleteMutation.mutate();
            }
          }}
        />
      )}
    </div>
  );
}
