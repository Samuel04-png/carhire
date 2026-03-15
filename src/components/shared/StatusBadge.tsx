import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  tone:
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "neutral"
    | "gold";
  children: ReactNode;
  className?: string;
};

const styles = {
  success:
    "bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20",
  warning:
    "bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/20",
  danger:
    "bg-[var(--color-error)]/10 text-[var(--color-error)] border-[var(--color-error)]/20",
  info:
    "bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-[var(--color-accent)]/20",
  neutral:
    "bg-[var(--color-gray-100)] text-[var(--color-gray-600)] border-[var(--color-gray-300)]/70",
  gold:
    "bg-[var(--color-gold)]/10 text-[var(--color-gold)] border-[var(--color-gold)]/20",
};

export function StatusBadge({ tone, children, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]",
        styles[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
