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
        "space-y-3",
        align === "center" && "mx-auto max-w-3xl text-center",
        className,
      )}
    >
      {eyebrow && (
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
          {eyebrow}
        </div>
      )}
      <h2 className="font-display text-2xl font-bold tracking-[-0.03em] text-[var(--color-primary)] md:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-sm leading-6 text-[var(--color-gray-600)] md:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
