import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export interface IssueFilterBarProps {
  search: string;
  year: string;
  years: number[];
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onClear: () => void;
}

export function IssueFilterBar({
  search,
  year,
  years,
  hasActiveFilters,
  onSearchChange,
  onYearChange,
  onClear,
}: IssueFilterBarProps) {

  return (
    <div className="mb-6 rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Label htmlFor="search" className="mb-1.5 block text-xs font-medium text-muted-foreground">
            关键词搜索
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              type="text"
              placeholder="搜索杂志名或设计师姓名…"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="sm:w-40">
          <Label htmlFor="year" className="mb-1.5 block text-xs font-medium text-muted-foreground">
            年份筛选
          </Label>
          <Select
            id="year"
            value={year}
            onChange={(e) => onYearChange(e.target.value)}
          >
            <option value="">全部年份</option>
            {years.map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </Select>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-9 gap-1"
          >
            <X className="h-4 w-4" />
            清除
          </Button>
        )}
      </div>
    </div>
  );
}
