import { differenceInCalendarDays, isAfter, set } from "date-fns";
import { bookingExtras, vehicles } from "@/data/mock";
import type { BookingDraft, FleetFilters, Vehicle } from "@/types";

export const defaultFleetFilters: FleetFilters = {
  category: "All",
  transmission: "Any",
  seats: "Any",
  driverMode: "Any",
  city: "All",
  minPrice: 0,
  maxPrice: 5000,
  sort: "Most Popular",
  search: "",
};

export function buildDateTime(date: string, time: string) {
  if (!date) return null;
  const base = new Date(date);
  const [hours, minutes] = time.split(":").map((value) => Number(value || 0));
  return set(base, { hours, minutes, seconds: 0, milliseconds: 0 });
}

export function calculateDays(draft: BookingDraft) {
  const pickup = buildDateTime(draft.pickupDate, draft.pickupTime);
  const dropoff = buildDateTime(draft.returnDate, draft.returnTime);
  if (!pickup || !dropoff) return 0;
  return Math.max(1, differenceInCalendarDays(dropoff, pickup) || 1);
}

export function validateTripDetails(draft: BookingDraft) {
  const pickup = buildDateTime(draft.pickupDate, draft.pickupTime);
  const dropoff = buildDateTime(draft.returnDate, draft.returnTime);

  if (!pickup || !dropoff || !draft.pickupLocation.trim()) {
    return { valid: false, message: "Complete all required trip details." };
  }

  const minPickup = new Date(Date.now() + 2 * 60 * 60 * 1000);
  if (!isAfter(pickup, minPickup)) {
    return {
      valid: false,
      message: "Pickup time must be at least 2 hours from now.",
    };
  }

  if (!isAfter(dropoff, pickup)) {
    return {
      valid: false,
      message: "Return time must be after pickup time.",
    };
  }

  return { valid: true, message: "" };
}

export function getVehicleById(vehicleId: string | null) {
  return vehicles.find((vehicle) => vehicle.id === vehicleId) ?? null;
}

export function calculateBookingTotal(draft: BookingDraft, vehicle?: Vehicle | null) {
  if (!vehicle) return 0;
  const days = calculateDays(draft);
  const baseRate = vehicle.cityRates?.[draft.pickupCity] ?? vehicle.baseDailyRate;
  const base = baseRate * days;
  const chauffeur = draft.withDriver ? vehicle.chauffeurRate * days : 0;
  const extras = draft.extras.reduce((sum, extraId) => {
    const extra = bookingExtras.find((item) => item.id === extraId);
    if (!extra) return sum;
    return sum + (extra.pricing === "daily" ? extra.price * days : extra.price);
  }, 0);
  const taxes = Math.round((base + chauffeur + extras) * 0.08);
  return base + chauffeur + extras + taxes;
}

export function filterVehicles(filters: FleetFilters) {
  const query = filters.search.trim().toLowerCase();

  return vehicles
    .filter((vehicle) => {
      if (filters.category !== "All" && vehicle.category !== filters.category) {
        return false;
      }
      if (
        filters.transmission !== "Any" &&
        vehicle.transmission !== filters.transmission
      ) {
        return false;
      }
      if (filters.driverMode === "Chauffeur" && !vehicle.withDriverAvailable) {
        return false;
      }
      if (filters.driverMode === "Self-Drive" && vehicle.category === "Luxury") {
        return false;
      }
      if (filters.city !== "All" && !vehicle.cities.includes(filters.city)) {
        return false;
      }
      if (
        filters.seats === "2-4" &&
        !(vehicle.seats >= 2 && vehicle.seats <= 4)
      ) {
        return false;
      }
      if (filters.seats === "5" && vehicle.seats !== 5) {
        return false;
      }
      if (filters.seats === "6-7" && !(vehicle.seats >= 6 && vehicle.seats <= 7)) {
        return false;
      }
      if (filters.seats === "8+" && vehicle.seats < 8) {
        return false;
      }
      if (vehicle.baseDailyRate < filters.minPrice) {
        return false;
      }
      if (vehicle.baseDailyRate > filters.maxPrice) {
        return false;
      }
      if (
        query &&
        !`${vehicle.name} ${vehicle.make} ${vehicle.model} ${vehicle.category}`
          .toLowerCase()
          .includes(query)
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (filters.sort) {
        case "Price Low-High":
          return a.baseDailyRate - b.baseDailyRate;
        case "Price High-Low":
          return b.baseDailyRate - a.baseDailyRate;
        case "Newest":
          return Number(b.newest) - Number(a.newest);
        case "Most Popular":
        default:
          return Number(b.popular) - Number(a.popular) || b.rating - a.rating;
      }
    });
}
