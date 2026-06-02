import type { Booking, BookingStatus, Vehicle } from "@/types";

export const inventoryHoldingStatuses: BookingStatus[] = [
  "Approved",
  "Agreement Sent",
  "Agreement Accepted",
  "Active",
];

export function bookingHoldsFleet(status: BookingStatus) {
  return inventoryHoldingStatuses.includes(status);
}

export function normaliseVehicleQuantities(vehicle: Vehicle): Vehicle {
  const totalQuantity = Math.max(0, Number(vehicle.totalQuantity ?? 1));
  const availableQuantity = Math.max(
    0,
    Math.min(totalQuantity, Number(vehicle.availableQuantity ?? (vehicle.status === "Available" ? totalQuantity : 0))),
  );

  return {
    ...vehicle,
    pricePerDay: vehicle.pricePerDay ?? vehicle.baseDailyRate,
    totalQuantity,
    availableQuantity,
  };
}

export function visibleVehicleStatus(vehicle: Vehicle): Vehicle["status"] {
  if (vehicle.status === "Maintenance" || vehicle.status === "Retired" || vehicle.status === "Inactive") {
    return vehicle.status;
  }
  return vehicle.availableQuantity > 0 ? "Available" : "On Hire";
}

export function canVehicleBeBooked(vehicle: Vehicle) {
  return ["Available", "Active", "On Hire", "On Request"].includes(vehicle.status) && vehicle.availableQuantity > 0;
}

export function transitionBookingInventory(
  vehicles: Vehicle[],
  booking: Booking,
  nextStatus: BookingStatus,
): { vehicles: Vehicle[]; error?: string } {
  const currentlyHeld = bookingHoldsFleet(booking.status);
  const shouldHold = bookingHoldsFleet(nextStatus);

  if (currentlyHeld === shouldHold) {
    return { vehicles };
  }

  const vehicle = vehicles.find((item) => item.id === booking.vehicleId);
  if (!vehicle) {
    return { vehicles, error: "Vehicle record not found." };
  }

  if (!currentlyHeld && shouldHold && vehicle.availableQuantity <= 0) {
    return { vehicles, error: `${vehicle.name} has no available quantity left.` };
  }

  return {
    vehicles: vehicles.map((item) => {
      if (item.id !== booking.vehicleId) return item;
      const nextAvailable = !currentlyHeld && shouldHold
        ? item.availableQuantity - 1
        : item.availableQuantity + 1;
      return normaliseVehicleQuantities({
        ...item,
        availableQuantity: nextAvailable,
        status: nextAvailable > 0 ? "Available" : "On Hire",
      });
    }),
  };
}

export function getAgreementStatus(booking: Booking): NonNullable<Booking["agreementStatus"]> {
  if (booking.agreementAccepted) return "Accepted";
  if (["Agreement Sent", "Agreement Accepted", "Active", "Completed"].includes(booking.status)) return "Sent";
  return booking.agreementStatus ?? "Not Sent";
}
