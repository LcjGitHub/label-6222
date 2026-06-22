import { useState } from "react";
import { ExternalLink, Type, ImageIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Issue } from "@/types/issue";

interface IssueDetailCardProps {
  issue: Issue;
  onEdit?: () => void;
  onDelete?: () => void;
}

/**
 * 封面字体分析详情卡片。
 * @param props.issue - 期号数据
 * @param props.onEdit - 编辑回调
 * @param props.onDelete - 删除回调
 */
export function IssueDetailCard({ issue, onEdit, onDelete }: IssueDetailCardProps) {
  const [coverError, setCoverError] = useState(false);

  return (
    <Card className="overflow-hidden">
      {issue.cover_image && !coverError && (
        <div className="w-full bg-muted">
          <img
            src={issue.cover_image}
            alt={`${issue.magazine_name} 封面`}
            className="w-full object-cover"
            style={{ maxHeight: "480px" }}
            onError={() => setCoverError(true)}
          />
        </div>
      )}
      {issue.cover_image && coverError && (
        <div className="flex h-60 w-full items-center justify-center bg-muted">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImageIcon className="h-10 w-10" />
            <span className="text-sm">封面图片加载失败</span>
          </div>
        </div>
      )}
      <CardHeader className="border-b bg-secondary/30">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-2xl tracking-tight">
              {issue.magazine_name}
            </CardTitle>
            <CardDescription className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{issue.issue_number}</Badge>
              <Badge variant="outline">{issue.year}</Badge>
            </CardDescription>
          </div>
          <Type className="h-8 w-8 text-muted-foreground" aria-hidden />
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {issue.tags && issue.tags.length > 0 && (
          <section>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              字体分类
            </h4>
            <div className="flex flex-wrap gap-2">
              {issue.tags.map((tag) => (
                <Badge key={tag.id} variant="default">
                  {tag.name}
                </Badge>
              ))}
            </div>
          </section>
        )}

        <section>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            字体描述
          </h4>
          <p className="leading-relaxed text-foreground/90">
            {issue.font_description}
          </p>
        </section>

        <section>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            设计师
          </h4>
          <p>{issue.designer}</p>
        </section>

        {issue.link && (
          <section>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              参考链接
            </h4>
            <a
              href={issue.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
            >
              {issue.link}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </section>
        )}

        {(onEdit || onDelete) && (
          <div className="flex gap-2 border-t pt-4">
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                编辑
              </Button>
            )}
            {onDelete && (
              <Button variant="destructive" size="sm" onClick={onDelete}>
                删除
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
