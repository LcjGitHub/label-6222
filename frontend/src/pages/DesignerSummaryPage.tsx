import { useQuery } from "@tanstack/react-query";
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchDesignerSummary } from "@/api/issues";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function DesignerSummaryPage() {
  const { data: designers = [], isLoading, error } = useQuery({
    queryKey: ["designers-summary"],
    queryFn: fetchDesignerSummary,
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <header className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          设计师汇总统计
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          设计师汇总
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          按设计师聚合统计收录期号数量，点击卡片查看该设计师的全部作品。
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

      {!isLoading && !error && designers.length === 0 && (
        <p className="text-center text-muted-foreground">暂无设计师数据。</p>
      )}

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {designers.map((d) => (
          <li key={d.name}>
            <Link
              to={`/?designer=${encodeURIComponent(d.name)}`}
              className="block"
            >
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <User className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{d.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="flex items-center gap-3">
                    <Badge variant="secondary">
                      {d.issue_count} 期
                    </Badge>
                    <Badge variant="outline">
                      最近 {d.latest_year}
                    </Badge>
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
