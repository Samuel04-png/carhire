import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: Props) {
  return (
    <div
      className={cn(
        "space-y-4",
        align === "center" && "mx-auto max-w-3xl text-center",
        className,
      )}
    >
      {eyebrow && (
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--color-accent)]">
          <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
          {eyebrow}
        </div>
      )}
      <h2 className="font-display text-4xl font-bold tracking-[-0.04em] text-[var(--color-primary)] md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-base leading-7 text-[var(--color-gray-600)] md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
