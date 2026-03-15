import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Activity, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  AdminSettings,
  BookingStatus,
  DriverStatus,
  PaymentStatus,
  VehicleStatus,
} from "@/types";

export function MetricCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  accent: "blue" | "navy" | "green" | "amber";
}) {
  const accentClasses = {
    blue: "bg-[rgba(26,127,212,0.12)] text-[var(--color-accent)]",
    navy: "bg-[rgba(10,22,40,0.08)] text-[var(--color-primary)]",
    green: "bg-[rgba(34,197,94,0.12)] text-[var(--color-success)]",
    amber: "bg-[rgba(245,158,11,0.12)] text-[var(--color-warning)]",
  };

  return (
    <div className="rounded-[30px] border border-[var(--color-gray-200)] bg-white p-6 shadow-[0_18px_60px_rgba(10,22,40,0.06)]">
      <div className="flex items-center gap-3">
        <div className={cn("grid h-12 w-12 place-items-center rounded-2xl", accentClasses[accent])}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="text-xs uppercase tracking-[0.22em] text-[var(--color-gray-500)]">{label}</div>
      </div>
      <div className="mt-6 font-display text-4xl font-bold tracking-[-0.05em] text-[var(--color-primary)]">{value}</div>
    </div>
  );
}

export function SurfaceCard({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-[32px] border border-[var(--color-gray-200)] bg-white p-6 shadow-[0_18px_60px_rgba(10,22,40,0.06)]", className)}>
      <div>
        <div className="font-display text-3xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">{title}</div>
        {subtitle && <div className="mt-2 text-sm text-[var(--color-gray-600)]">{subtitle}</div>}
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}

export function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: "blue" | "navy" | "green" | "amber" | "slate";
}) {
  const tones = {
    blue: "bg-[rgba(26,127,212,0.12)] text-[var(--color-accent)]",
    navy: "bg-[rgba(10,22,40,0.08)] text-[var(--color-primary)]",
    green: "bg-[rgba(34,197,94,0.12)] text-[var(--color-success)]",
    amber: "bg-[rgba(245,158,11,0.12)] text-[var(--color-warning)]",
    slate: "bg-[var(--color-gray-100)] text-[var(--color-gray-600)]",
  };

  return <span className={cn("rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]", tones[tone])}>{label}</span>;
}

export function AlertTile({
  title,
  description,
  tone,
}: {
  title: string;
  description: string;
  tone: "blue" | "green" | "amber";
}) {
  const toneClasses = {
    blue: "border-[rgba(26,127,212,0.16)] bg-[rgba(26,127,212,0.06)]",
    green: "border-[rgba(34,197,94,0.16)] bg-[rgba(34,197,94,0.06)]",
    amber: "border-[rgba(245,158,11,0.16)] bg-[rgba(245,158,11,0.06)]",
  };

  return (
    <div className={cn("rounded-[24px] border p-4", toneClasses[tone])}>
      <div className="font-semibold text-[var(--color-primary)]">{title}</div>
      <div className="mt-2 text-sm text-[var(--color-gray-600)]">{description}</div>
    </div>
  );
}

export function InfoBlock({
  label,
  value,
  subvalue,
}: {
  label: string;
  value: string;
  subvalue?: string;
}) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">{label}</div>
      <div className="mt-2 font-semibold text-[var(--color-primary)]">{value}</div>
      {subvalue && <div className="mt-1 text-sm text-[var(--color-gray-600)]">{subvalue}</div>}
    </div>
  );
}

export function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-[20px] bg-[var(--color-gray-100)] px-4 py-3">
      <span className="text-sm text-[var(--color-gray-600)]">{label}</span>
      <span className="max-w-[60%] text-right text-sm font-semibold text-[var(--color-primary)]">{value}</span>
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <label>
      <FieldLabel>{label}</FieldLabel>
      <input className={inputClassName} type={type} value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">{children}</div>;
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-[30px] border border-dashed border-[var(--color-gray-300)] bg-white px-6 py-12 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[var(--color-gray-100)] text-[var(--color-accent)]">
        <Sparkles className="h-5 w-5" />
      </div>
      <div className="mt-5 font-display text-3xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">{title}</div>
      <div className="mx-auto mt-3 max-w-xl text-sm text-[var(--color-gray-600)]">{description}</div>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function bookingStatusTone(status: BookingStatus) {
  if (status === "Completed") return "green" as const;
  if (status === "Active") return "blue" as const;
  if (status === "Confirmed") return "navy" as const;
  if (status === "Pending") return "amber" as const;
  return "slate" as const;
}

export function paymentStatusTone(status: PaymentStatus) {
  if (status === "Paid") return "green" as const;
  if (status === "Partial") return "blue" as const;
  if (status === "Pending Payment") return "amber" as const;
  return "slate" as const;
}

export function vehicleStatusTone(status: VehicleStatus) {
  if (status === "Available") return "green" as const;
  if (status === "On Hire") return "blue" as const;
  if (status === "Maintenance") return "amber" as const;
  return "slate" as const;
}

export function driverStatusTone(status: DriverStatus) {
  if (status === "Available") return "green" as const;
  if (status === "On Trip") return "blue" as const;
  if (status === "Off Duty") return "amber" as const;
  return "slate" as const;
}

export function bookingStatusColor(status: BookingStatus) {
  switch (status) {
    case "Completed":
      return "#22C55E";
    case "Active":
      return "#1A7FD4";
    case "Confirmed":
      return "#0A1628";
    case "Pending":
      return "#F59E0B";
    default:
      return "#CBD5E1";
  }
}

export function settingsSectionTitle(section: keyof AdminSettings) {
  switch (section) {
    case "companyProfile":
      return "Company profile";
    case "bookingRules":
      return "Booking rules";
    case "pricingRules":
      return "Pricing rules";
    case "notifications":
      return "Notifications";
    case "paymentSettings":
      return "Payment settings";
    case "cms":
      return "Website content";
    default:
      return "Settings";
  }
}

export function buildCsv(rows: Array<Record<string, string | number>>) {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  rows.forEach((row) => {
    lines.push(
      headers
        .map((header) => `${String(row[header]).replace(/"/g, '""')}`)
        .map((value) => `"${value}"`)
        .join(","),
    );
  });
  return lines.join("\n");
}

export function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function toPhoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function toWhatsAppHref(phone: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}`;
}

export function offsetDate(days: number) {
  const next = new Date();
  next.setDate(next.getDate() + days);
  return next.toISOString().slice(0, 10);
}

export const inputClassName =
  "h-12 w-full rounded-2xl border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-4 text-sm outline-none transition focus:border-[var(--color-accent)]";

export const textareaClassName =
  "min-h-[120px] w-full rounded-[24px] border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-accent)]";

export const chipClassName =
  "rounded-full border border-[var(--color-gray-200)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-gray-600)] transition hover:border-[var(--color-gray-300)]";

export const activeChipClassName =
  "border-[var(--color-accent)] bg-[rgba(26,127,212,0.08)] text-[var(--color-accent)]";
