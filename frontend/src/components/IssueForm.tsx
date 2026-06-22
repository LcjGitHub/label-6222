import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { IssueInput } from "@/types/issue";

interface IssueFormProps {
  initial?: Partial<IssueInput>;
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
};

/**
 * 期号创建/编辑表单。
 */
export function IssueForm({
  initial,
  onSubmit,
  onCancel,
  isSubmitting,
}: IssueFormProps) {
  const [form, setForm] = useState<IssueInput>({
    ...EMPTY,
    ...initial,
    link: initial?.link ?? "",
  });

  const handleChange = (
    field: keyof IssueInput,
    value: string | number
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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
