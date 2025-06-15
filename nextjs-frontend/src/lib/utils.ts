import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatHealthScore(score: number): string {
  return score.toFixed(1);
}

export function getHealthScoreColor(score: number): string {
  if (score >= 8) return "text-green-600";
  if (score >= 6) return "text-yellow-600";
  if (score >= 4) return "text-orange-600";
  return "text-red-600";
} 