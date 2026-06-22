import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 合并 Tailwind 类名，避免冲突。
 * @param inputs - 类名片段
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
