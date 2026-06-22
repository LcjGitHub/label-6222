import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, ImageIcon, SearchX } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { createIssue, deleteIssue, fetchIssues, fetchIssueYears } from "@/api/issues";
import { IssueForm } from "@/components/IssueForm";
import { IssueFilterBar } from "@/components/IssueFilterBar";
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
 * 期号列表页：展示全部杂志封面研究条目，支持搜索、筛选、新建与删除。
 */
export function IssueListPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const designerFilter = searchParams.get("designer") || "";
  const searchQuery = searchParams.get("search") || "";
  const yearQuery = searchParams.get("year") || "";

  const [searchInput, setSearchInput] = useState(searchQuery);
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  useEffect(() => {
    setSearchInput(searchQuery);
    setDebouncedSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      const nextParams = new URLSearchParams(searchParams);
      if (searchInput) {
        nextParams.set("search", searchInput);
      } else {
        nextParams.delete("search");
      }
      setSearchParams(nextParams, { replace: true });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: years = [] } = useQuery({
    queryKey: ["issue-years"],
    queryFn: fetchIssueYears,
  });

  const { data: issues = [], isLoading, error } = useQuery({
    queryKey: ["issues", debouncedSearch, yearQuery, designerFilter],
    queryFn: () =>
      fetchIssues({
        search: debouncedSearch || undefined,
        year: yearQuery || undefined,
        designer: designerFilter || undefined,
      }),
  });

  const hasActiveFilters =
    debouncedSearch !== "" || yearQuery !== "" || designerFilter !== "";
  const isOnlyDesignerFilter =
    designerFilter !== "" && debouncedSearch === "" && yearQuery === "";

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleYearChange = (value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set("year", value);
    } else {
      nextParams.delete("year");
    }
    setSearchParams(nextParams);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    const nextParams = new URLSearchParams();
    setSearchParams(nextParams);
  };

  const createMutation = useMutation({
    mutationFn: createIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      queryClient.invalidateQueries({ queryKey: ["designers-summary"] });
      queryClient.invalidateQueries({ queryKey: ["statistics"] });
      setShowForm(false);
    },
  });

  const createError = createMutation.error
    ? (createMutation.error as any)?.response?.data?.error || "保存失败，请稍后重试"
    : null;

  const deleteMutation = useMutation({
    mutationFn: deleteIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      queryClient.invalidateQueries({ queryKey: ["designers-summary"] });
      queryClient.invalidateQueries({ queryKey: ["statistics"] });
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
                onClick={handleClearFilters}
              >
                清除筛选
              </Button>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowForm((v) => !v)}>
            <Plus className="h-4 w-4" />
            新增期号
          </Button>
        </div>
      </header>

      <IssueFilterBar
        search={searchInput}
        year={yearQuery}
        years={years}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={handleSearchChange}
        onYearChange={handleYearChange}
        onClear={handleClearFilters}
      />

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
              error={createError}
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
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <SearchX className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <p className="text-base font-medium">
              {hasActiveFilters ? "未找到匹配的结果" : "暂无数据"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {isOnlyDesignerFilter
                ? `「${designerFilter}」暂无收录期号，可点击清除筛选查看全部`
                : hasActiveFilters
                  ? "尝试更换关键词、调整年份筛选或清除筛选条件"
                  : "点击上方「新增期号」按钮开始收录"}
            </p>
          </div>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={handleClearFilters}>
              清除全部筛选
            </Button>
          )}
        </div>
      )}

      <ul className="grid gap-4">
        {issues.map((issue) => (
          <li key={issue.id}>
            <Card className="transition-shadow hover:shadow-md">
              <div className="flex">
                <div className="flex h-32 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-l-lg bg-muted">
                  {issue.cover_image ? (
                    <>
                      <img
                        src={issue.cover_image}
                        alt={`${issue.magazine_name} 封面`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = "none";
                          const failPlaceholder = target.parentElement?.querySelector(
                            "[data-placeholder='fail']"
                          ) as HTMLElement | null;
                          if (failPlaceholder) failPlaceholder.style.display = "flex";
                        }}
                      />
                      <div
                        data-placeholder="fail"
                        className="hidden h-full w-full flex-col items-center justify-center gap-1 text-muted-foreground"
                      >
                        <ImageIcon className="h-6 w-6" />
                        <span className="text-[10px]">封面加载失败</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted-foreground">
                      <ImageIcon className="h-6 w-6" />
                      <span className="text-[10px]">无封面</span>
                    </div>
                  )}
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
