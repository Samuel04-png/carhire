import type {
  BookingSource,
  BookingStatus,
  DriverStatus,
  PaymentMethod,
  PaymentStatus,
  Transmission,
  VehicleCategory,
  VehicleStatus,
} from "@/types";

export const bookingStatusOptions: BookingStatus[] = [
  "Pending",
  "Confirmed",
  "Active",
  "Completed",
  "Cancelled",
];

export const paymentStatusOptions: PaymentStatus[] = [
  "Pending Payment",
  "Paid",
  "Partial",
  "Refunded",
];

export const vehicleStatusOptions: VehicleStatus[] = [
  "Available",
  "On Hire",
  "Maintenance",
  "Retired",
  "On Request",
];

export const driverStatusOptions: DriverStatus[] = [
  "Available",
  "On Trip",
  "Off Duty",
  "Suspended",
];

export const bookingSourceOptions: BookingSource[] = [
  "Online",
  "Phone",
  "Walk-in",
  "WhatsApp",
  "Corporate Account",
  "Referral",
];

export const paymentMethodOptions: PaymentMethod[] = [
  "MTN Mobile Money",
  "Airtel Money",
  "Zamtel Money",
  "Bank Transfer",
  "Credit / Debit Card",
  "Pay on Pickup",
];

export const vehicleCategoryOptions: VehicleCategory[] = [
  "Economy",
  "Saloon",
  "SUV",
  "Minibus",
  "Luxury",
  "Pickup",
];

export const transmissionOptions: Transmission[] = ["Automatic", "Manual"];
