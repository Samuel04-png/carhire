import { format, formatDistanceToNowStrict } from "date-fns";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-ZM", {
    style: "currency",
    currency: "ZMW",
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace("ZMW", "K");
}

export function formatDateTime(value: string) {
  return format(new Date(value), "dd MMM yyyy, HH:mm");
}

export function formatDateOnly(value: string) {
  return format(new Date(value), "dd MMM yyyy");
}

export function formatShortDate(value: string) {
  return format(new Date(value), "dd MMM");
}

export function relativeDate(value: string) {
  return formatDistanceToNowStrict(new Date(value), { addSuffix: true });
}
