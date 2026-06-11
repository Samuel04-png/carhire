import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  AdminSettings,
  BookingStatus,
  DriverStatus,
  PaymentStatus,
  VehicleStatus,
} from "@/types";

const metricAccentClasses = {
  blue: "bg-[var(--brand-soft)] text-[var(--brand)] ring-[rgba(22,119,210,0.14)]",
  navy: "bg-[#eef3f8] text-[var(--bg-sidebar)] ring-[rgba(7,29,51,0.12)]",
  green: "bg-[var(--success-soft)] text-[var(--success-ui)] ring-[rgba(24,180,107,0.14)]",
  amber: "bg-[var(--warning-soft)] text-[var(--warning-ui)] ring-[rgba(245,158,11,0.16)]",
};

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
  return (
    <div className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--border-soft)] hover:shadow-[var(--shadow-card-hover)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--brand)]/70 via-[var(--brand)]/20 to-transparent" />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-soft)]">{label}</div>
          <div className="mt-4 font-display text-3xl font-semibold tracking-[-0.04em] text-[var(--text-main)] tabular-nums">{value}</div>
          <div className="mt-2 text-xs font-medium text-[var(--text-muted)]">Current operational count</div>
        </div>
        <div className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-[var(--radius-md)] ring-1", metricAccentClasses[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
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
    <section className={cn("rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)] sm:p-6", className)}>
      <div className="flex flex-col gap-1.5">
        <h2 className="font-display text-lg font-semibold tracking-[-0.025em] text-[var(--text-main)] sm:text-xl">{title}</h2>
        {subtitle && <p className="max-w-3xl text-sm leading-6 text-[var(--text-muted)]">{subtitle}</p>}
      </div>
      <div className="mt-5">{children}</div>
    </section>
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
    blue: "border-[rgba(22,119,210,0.18)] bg-[var(--brand-soft)] text-[var(--brand-dark)]",
    navy: "border-[rgba(7,29,51,0.14)] bg-[#eef3f8] text-[var(--bg-sidebar)]",
    green: "border-[rgba(24,180,107,0.18)] bg-[var(--success-soft)] text-[#0b7a47]",
    amber: "border-[rgba(245,158,11,0.22)] bg-[var(--warning-soft)] text-[#a15c02]",
    slate: "border-[var(--border-soft)] bg-[var(--bg-surface-soft)] text-[var(--text-muted)]",
  };

  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em]", tones[tone])}>{label}</span>;
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
    blue: "border-l-[var(--brand)] bg-[var(--info-soft)]",
    green: "border-l-[var(--success-ui)] bg-[var(--success-soft)]",
    amber: "border-l-[var(--warning-ui)] bg-[var(--warning-soft)]",
  };

  return (
    <div className={cn("rounded-[var(--radius-md)] border border-[var(--border-subtle)] border-l-4 px-4 py-3.5", toneClasses[tone])}>
      <div className="text-sm font-semibold text-[var(--text-main)]">{title}</div>
      <div className="mt-1 text-sm leading-6 text-[var(--text-muted)]">{description}</div>
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
    <div className="rounded-[var(--radius-md)] bg-[var(--bg-surface-soft)] px-4 py-3">
      <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-soft)]">{label}</div>
      <div className="mt-2 font-semibold text-[var(--text-main)]">{value}</div>
      {subvalue && <div className="mt-1 text-sm text-[var(--text-muted)]">{subvalue}</div>}
    </div>
  );
}

export function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-[var(--radius-md)] bg-[var(--bg-surface-soft)] px-4 py-3 ring-1 ring-[var(--border-subtle)]">
      <span className="text-sm text-[var(--text-muted)]">{label}</span>
      <span className="max-w-[60%] text-right text-sm font-semibold text-[var(--text-main)]">{value}</span>
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
  return <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.13em] text-[var(--text-soft)]">{children}</div>;
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
    <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border-soft)] bg-white px-6 py-12 text-center shadow-[var(--shadow-card)]">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-[var(--radius-md)] bg-[var(--brand-soft)] text-[var(--brand)]">
        <Activity className="h-5 w-5" />
      </div>
      <div className="mt-4 font-display text-xl font-semibold tracking-[-0.025em] text-[var(--text-main)]">{title}</div>
      <div className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[var(--text-muted)]">{description}</div>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function bookingStatusTone(status: BookingStatus) {
  if (status === "Completed" || status === "Agreement Accepted") return "green" as const;
  if (status === "Active" || status === "Agreement Sent") return "blue" as const;
  if (status === "Approved") return "navy" as const;
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
      return "#18b46b";
    case "Active":
      return "#1677d2";
    case "Approved":
      return "#071d33";
    case "Pending":
      return "#f59e0b";
    default:
      return "#cbd5e1";
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
  "h-12 w-full rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-surface-soft)] px-4 text-sm text-[var(--text-main)] outline-none transition-all duration-200 placeholder:text-[var(--text-soft)] hover:border-[#cfd9e6] focus:border-[var(--brand)] focus:bg-white focus:ring-4 focus:ring-[rgba(22,119,210,0.12)] disabled:cursor-not-allowed disabled:opacity-60";

export const textareaClassName =
  "min-h-[120px] w-full rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-surface-soft)] px-4 py-3 text-sm text-[var(--text-main)] outline-none transition-all duration-200 placeholder:text-[var(--text-soft)] hover:border-[#cfd9e6] focus:border-[var(--brand)] focus:bg-white focus:ring-4 focus:ring-[rgba(22,119,210,0.12)] disabled:cursor-not-allowed disabled:opacity-60";

export const chipClassName =
  "rounded-full border border-[var(--border-soft)] bg-white px-4 py-2 text-sm font-semibold text-[var(--text-muted)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--brand)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand-dark)]";

export const activeChipClassName =
  "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand-dark)] shadow-[0_8px_18px_rgba(22,119,210,0.10)]";
