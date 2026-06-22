import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchTags } from "@/api/issues";
import type { IssueInput } from "@/types/issue";
import { cn } from "@/lib/utils";

interface IssueFormProps {
  initial?: Partial<IssueInput> & { tags?: { id: number; name: string }[] };
  onSubmit: (data: IssueInput) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const EMPTY: IssueInput = {
  magazine_name: "",
  issue_number: "",
  year: new Date().getFullYear(),
  font_description: "",
  designer: "",
  link: "",
  tag_ids: [],
};

/**
 * 期号创建/编辑表单（含标签多选）。
 */
export function IssueForm({
  initial,
  onSubmit,
  onCancel,
  isSubmitting,
}: IssueFormProps) {
  const { data: tags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
  });

  const initialTagIds = initial?.tags
    ? initial.tags.map((t) => t.id)
    : initial?.tag_ids ?? [];

  const [form, setForm] = useState<IssueInput>({
    ...EMPTY,
    ...initial,
    link: initial?.link ?? "",
    tag_ids: initialTagIds,
  });

  const handleChange = (
    field: keyof IssueInput,
    value: string | number | number[]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleTag = (tagId: number) => {
    setForm((prev) => ({
      ...prev,
      tag_ids: prev.tag_ids.includes(tagId)
        ? prev.tag_ids.filter((id) => id !== tagId)
        : [...prev.tag_ids, tagId],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="magazine_name">杂志名</Label>
          <Input
            id="magazine_name"
            value={form.magazine_name}
            onChange={(e) => handleChange("magazine_name", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="issue_number">期号</Label>
          <Input
            id="issue_number"
            value={form.issue_number}
            onChange={(e) => handleChange("issue_number", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="year">年份</Label>
          <Input
            id="year"
            type="number"
            value={form.year}
            onChange={(e) => handleChange("year", Number(e.target.value))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="designer">设计师</Label>
          <Input
            id="designer"
            value={form.designer}
            onChange={(e) => handleChange("designer", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>字体分类标签</Label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const selected = form.tag_ids.includes(tag.id);
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={cn(
                  "cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                  selected
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {tag.name}
              </button>
            );
          })}
          {tags.length === 0 && (
            <span className="text-sm text-muted-foreground">加载标签中…</span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="font_description">字体描述</Label>
        <Textarea
          id="font_description"
          value={form.font_description}
          onChange={(e) => handleChange("font_description", e.target.value)}
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="link">链接（可选）</Label>
        <Input
          id="link"
          type="url"
          value={form.link ?? ""}
          onChange={(e) => handleChange("link", e.target.value)}
          placeholder="https://"
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "保存中…" : "保存"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
      </div>
    </form>
  );
}
