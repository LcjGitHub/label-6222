import { useQuery } from "@tanstack/react-query";
import { BookOpen, Users, Layers, Calendar } from "lucide-react";
import { fetchStatistics } from "@/api/issues";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const statCards = [
  {
    key: "total_issues",
    label: "期号总数",
    icon: BookOpen,
    color: "bg-primary/10 text-primary",
  },
  {
    key: "total_magazines",
    label: "杂志种数",
    icon: Layers,
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    key: "total_designers",
    label: "设计师人数",
    icon: Users,
    color: "bg-amber-500/10 text-amber-600",
  },
  {
    key: "total_years",
    label: "覆盖年份",
    icon: Calendar,
    color: "bg-rose-500/10 text-rose-600",
  },
] as const;

export function OverviewPage() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["statistics"],
    queryFn: fetchStatistics,
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Data Overview
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">数据概览</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          汇总展示独立杂志封面字体研究的核心指标与年度收录趋势。
        </p>
      </header>

      {isLoading && (
        <p className="text-center text-muted-foreground">加载中…</p>
      )}

      {error && (
        <p className="text-center text-destructive">
          加载失败，请确认后端服务已启动（端口 4000）。
        </p>
      )}

      {!isLoading && !error && stats && (
        <>
          <section className="mb-12">
            <h2 className="mb-4 text-lg font-semibold">核心指标</h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {statCards.map((card) => {
                const Icon = card.icon;
                const value =
                  card.key === "total_years"
                    ? stats.yearly_counts.length
                    : stats[card.key as keyof typeof stats] as number;
                return (
                  <li key={card.key}>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {card.label}
                            </p>
                            <p className="mt-2 text-3xl font-bold tracking-tight">
                              {value}
                            </p>
                          </div>
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-full ${card.color}`}
                          >
                            <Icon className="h-6 w-6" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </li>
                );
              })}
            </ul>
          </section>

          <section>
            <Card>
              <CardHeader>
                <CardTitle>各年份收录数量</CardTitle>
                <CardDescription>
                  按年份降序排列，展示每年收录的期号数量。
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stats.yearly_counts.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">
                    暂无数据
                  </p>
                ) : (
                  <ul className="divide-y">
                    {stats.yearly_counts.map((item) => (
                      <li
                        key={item.year}
                        className="flex items-center justify-between py-3"
                      >
                        <span className="font-medium">{item.year} 年</span>
                        <span className="text-muted-foreground">
                          {item.count} 期
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </section>
        </>
      )}
    </div>
  );
}
