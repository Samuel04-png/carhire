import { create } from "zustand";
import { persist } from "zustand/middleware";
import { initialAdminSettings } from "@/data/admin";
import {
  bookingExtras,
  clients as initialClients,
  drivers as initialDrivers,
  initialBookings,
  vehicles as initialVehicles,
} from "@/data/mock";
import { calculateBookingTotal } from "@/lib/booking";
import type {
  AdminBookingInput,
  AdminRole,
  AdminSettings,
  AdminVehicleInput,
  Booking,
  BookingDraft,
  BookingStatus,
  Client,
  Driver,
  DriverStatus,
  PaymentMethod,
  PaymentStatus,
  Vehicle,
  VehicleStatus,
} from "@/types";

const defaultDraft: BookingDraft = {
  vehicleId: initialVehicles[0]?.id ?? null,
  pickupCity: "Lusaka",
  pickupLocation: "Kenneth Kaunda International Airport",
  customAddress: "",
  pickupDate: "",
  pickupTime: "10:00",
  returnDate: "",
  returnTime: "10:00",
  withDriver: false,
  flightNumber: "",
  tripType: "Arrival",
  extras: [],
  customer: {
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+260",
    phone: "",
    idNumber: "",
    licenseNumber: "",
    licenseExpiry: "",
    specialRequests: "",
    createAccount: false,
    password: "",
    confirmPassword: "",
    privacyAccepted: false,
  },
  paymentMethod: "MTN Mobile Money",
  mobileMoneyNetwork: "MTN",
};

function createRef() {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(
    2,
    "0",
  )}${String(now.getDate()).padStart(2, "0")}`;
  const suffix = Math.floor(1000 + Math.random() * 8999);
  return `SCH-${stamp}-${suffix}`;
}

function buildClientId() {
  return `cli_${Math.random().toString(36).slice(2, 8)}`;
}

function buildVehicleId() {
  return `veh_${Math.random().toString(36).slice(2, 8)}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ensureUniqueSlug(baseSlug: string, existingSlugs: string[]) {
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  let counter = 2;
  let nextSlug = `${baseSlug}-${counter}`;
  while (existingSlugs.includes(nextSlug)) {
    counter += 1;
    nextSlug = `${baseSlug}-${counter}`;
  }
  return nextSlug;
}

function createVehicleServices(input: AdminVehicleInput) {
  const services = new Set<string>(["self-drive"]);
  if (input.withDriverAvailable) {
    services.add("airport-transfers");
    services.add("corporate");
    services.add("events");
  }
  if (input.category === "Luxury") {
    services.add("weddings");
  }
  if (input.category === "Pickup" || input.category === "Minibus") {
    services.add("long-term");
  }
  return Array.from(services);
}

function createClientRecord(input: AdminBookingInput) {
  return {
    id: buildClientId(),
    firstName: input.customer.firstName.trim(),
    lastName: input.customer.lastName.trim(),
    email: input.customer.email.trim(),
    phone: input.customer.phone.trim(),
    city: input.pickupCity,
    tier: input.customer.accountType === "Corporate" ? "Gold" : "Standard",
    bookingCount: 0,
    totalSpend: 0,
    loyaltyPoints: 0,
    memberSince: new Date().toISOString(),
    accountType: input.customer.accountType,
    idNumber: "Pending verification",
    savedAddresses: [input.pickupLocation],
    preferences: {
      email: true,
      sms: true,
      whatsapp: true,
      promotions: false,
    },
    companyName: input.customer.companyName?.trim() || undefined,
    outstandingBalance:
      input.paymentStatus === "Paid" ? 0 : undefined,
  } satisfies Client;
}

function getCheckoutStatuses(paymentMethod: PaymentMethod) {
  if (paymentMethod === "Pay on Pickup") {
    return {
      status: "Confirmed" as BookingStatus,
      paymentStatus: "Pending Payment" as PaymentStatus,
    };
  }

  return {
    status: "Pending" as BookingStatus,
    paymentStatus: "Pending Payment" as PaymentStatus,
  };
}

type SubmitBookingOptions = {
  referenceOverride?: string;
  paymentReferenceId?: string;
};

type Store = {
  vehicles: Vehicle[];
  clients: Client[];
  drivers: Driver[];
  bookings: Booking[];
  bookingDraft: BookingDraft;
  customerSessionId: string | null;
  adminRole: AdminRole | null;
  adminSettings: AdminSettings;
  updateDraft: (partial: Partial<BookingDraft>) => void;
  updateDraftCustomer: (partial: Partial<BookingDraft["customer"]>) => void;
  setDraftVehicle: (vehicleId: string) => void;
  toggleDraftExtra: (extraId: string) => void;
  resetDraft: () => void;
  setCustomerSession: (clientId: string | null) => void;
  setAdminRole: (role: AdminRole | null) => void;
  submitBooking: (options?: SubmitBookingOptions) => { ref: string; total: number };
  createAdminBooking: (input: AdminBookingInput) => { ref: string; total: number };
  addVehicle: (input: AdminVehicleInput) => Vehicle;
  updateBookingStatus: (ref: string, status: BookingStatus) => void;
  updatePaymentStatus: (
    ref: string,
    paymentStatus: PaymentStatus,
    paymentMethod?: PaymentMethod,
  ) => void;
  assignDriver: (ref: string, driverId: string) => void;
  updateDriverStatus: (driverId: string, status: DriverStatus) => void;
  updateVehicleStatus: (vehicleId: string, status: VehicleStatus) => void;
  saveAdminSettings: (settings: AdminSettings) => void;
};

export const useAppStore = create<Store>()(
  persist(
    (set, get) => ({
      vehicles: initialVehicles,
      clients: initialClients,
      drivers: initialDrivers,
      bookings: initialBookings,
      bookingDraft: defaultDraft,
      customerSessionId: initialClients[0]?.id ?? null,
      adminRole: null,
      adminSettings: initialAdminSettings,

      updateDraft: (partial) =>
        set((state) => ({
          bookingDraft: { ...state.bookingDraft, ...partial },
        })),

      updateDraftCustomer: (partial) =>
        set((state) => ({
          bookingDraft: {
            ...state.bookingDraft,
            customer: { ...state.bookingDraft.customer, ...partial },
          },
        })),

      setDraftVehicle: (vehicleId) =>
        set((state) => ({
          bookingDraft: { ...state.bookingDraft, vehicleId },
        })),

      toggleDraftExtra: (extraId) =>
        set((state) => {
          const exists = state.bookingDraft.extras.includes(extraId);
          return {
            bookingDraft: {
              ...state.bookingDraft,
              extras: exists
                ? state.bookingDraft.extras.filter((item) => item !== extraId)
                : [...state.bookingDraft.extras, extraId],
            },
          };
        }),

      resetDraft: () => set({ bookingDraft: defaultDraft }),

      setCustomerSession: (clientId) => set({ customerSessionId: clientId }),
      setAdminRole: (role) => set({ adminRole: role }),

      submitBooking: (options) => {
        const state = get();
        const vehicle = state.vehicles.find(
          (item) => item.id === state.bookingDraft.vehicleId,
        );

        if (!vehicle) {
          return { ref: createRef(), total: 0 };
        }

        let clientId = state.customerSessionId;
        if (!clientId) {
          const createdId = buildClientId();
          const newClient: Client = {
            id: createdId,
            firstName: state.bookingDraft.customer.firstName || "Guest",
            lastName: state.bookingDraft.customer.lastName || "Client",
            email: state.bookingDraft.customer.email || `${createdId}@example.com`,
            phone: `${state.bookingDraft.customer.countryCode} ${state.bookingDraft.customer.phone}`.trim(),
            city: state.bookingDraft.pickupCity,
            tier: "Standard",
            bookingCount: 0,
            totalSpend: 0,
            loyaltyPoints: 0,
            memberSince: new Date().toISOString(),
            accountType: state.bookingDraft.customer.createAccount
              ? "Individual"
              : "Individual",
            idNumber: state.bookingDraft.customer.idNumber || "Pending",
            licenseNumber: state.bookingDraft.withDriver
              ? undefined
              : state.bookingDraft.customer.licenseNumber,
            licenseExpiry: state.bookingDraft.withDriver
              ? undefined
              : state.bookingDraft.customer.licenseExpiry,
            savedAddresses: state.bookingDraft.customAddress
              ? [state.bookingDraft.customAddress]
              : [],
            preferences: {
              email: true,
              sms: true,
              whatsapp: true,
              promotions: false,
            },
          };

          clientId = createdId;
          set((currentState) => ({
            clients: [...currentState.clients, newClient],
            customerSessionId: createdId,
          }));
        }

        const total = calculateBookingTotal(state.bookingDraft, vehicle);
        const ref = options?.referenceOverride || createRef();
        const checkoutStatuses = getCheckoutStatuses(state.bookingDraft.paymentMethod);
        const notes = [
          state.bookingDraft.customer.specialRequests.trim(),
          options?.paymentReferenceId
            ? `MTN MoMo reference: ${options.paymentReferenceId}`
            : "",
        ]
          .filter(Boolean)
          .join(" | ");
        const booking: Booking = {
          ref,
          vehicleId: vehicle.id,
          clientId: clientId!,
          pickupCity: state.bookingDraft.pickupCity,
          pickupLocation:
            state.bookingDraft.customAddress || state.bookingDraft.pickupLocation,
          pickupDateTime: `${state.bookingDraft.pickupDate}T${state.bookingDraft.pickupTime}:00`,
          returnDateTime: `${state.bookingDraft.returnDate}T${state.bookingDraft.returnTime}:00`,
          withDriver: state.bookingDraft.withDriver,
          extras: state.bookingDraft.extras,
          flightNumber: state.bookingDraft.flightNumber || undefined,
          tripType: state.bookingDraft.tripType,
          status: checkoutStatuses.status,
          paymentStatus: checkoutStatuses.paymentStatus,
          paymentMethod: state.bookingDraft.paymentMethod,
          source: "Online",
          amount: total,
          paymentReferenceId: options?.paymentReferenceId,
          createdAt: new Date().toISOString(),
          notes: notes || undefined,
        };

        set((currentState) => {
          const updatedClients = currentState.clients.map((client) =>
            client.id === clientId
              ? {
                  ...client,
                  bookingCount: client.bookingCount + 1,
                  totalSpend: client.totalSpend + total,
                  loyaltyPoints: client.loyaltyPoints + Math.round(total / 50),
                }
              : client,
          );

          return {
            bookings: [booking, ...currentState.bookings],
            clients: updatedClients,
            bookingDraft: {
              ...defaultDraft,
              vehicleId: currentState.bookingDraft.vehicleId,
            },
          };
        });

        return { ref, total };
      },

      createAdminBooking: (input) => {
        const state = get();
        const vehicle = state.vehicles.find((item) => item.id === input.vehicleId);

        if (!vehicle) {
          return { ref: createRef(), total: 0 };
        }

        let clientId = input.clientId;
        const createdClient =
          clientId == null || !state.clients.some((client) => client.id === clientId)
            ? createClientRecord(input)
            : null;

        if (createdClient) {
          clientId = createdClient.id;
        }

        const bookingDraft: BookingDraft = {
          vehicleId: input.vehicleId,
          pickupCity: input.pickupCity,
          pickupLocation: input.pickupLocation,
          customAddress: "",
          pickupDate: input.pickupDate,
          pickupTime: input.pickupTime,
          returnDate: input.returnDate,
          returnTime: input.returnTime,
          withDriver: input.withDriver,
          flightNumber: input.flightNumber ?? "",
          tripType: input.tripType ?? "Arrival",
          extras: input.extras,
          customer: {
            firstName: input.customer.firstName,
            lastName: input.customer.lastName,
            email: input.customer.email,
            countryCode: "+260",
            phone: input.customer.phone,
            idNumber: "",
            licenseNumber: "",
            licenseExpiry: "",
            specialRequests: input.notes ?? "",
            createAccount: false,
            password: "",
            confirmPassword: "",
            privacyAccepted: true,
          },
          paymentMethod: input.paymentMethod,
          mobileMoneyNetwork: "MTN",
        };

        const total = calculateBookingTotal(bookingDraft, vehicle);
        const ref = createRef();
        const createdAt = new Date().toISOString();
        const booking: Booking = {
          ref,
          vehicleId: input.vehicleId,
          clientId: clientId!,
          pickupCity: input.pickupCity,
          pickupLocation: input.pickupLocation,
          pickupDateTime: `${input.pickupDate}T${input.pickupTime}:00`,
          returnDateTime: `${input.returnDate}T${input.returnTime}:00`,
          withDriver: input.withDriver,
          extras: input.extras,
          flightNumber: input.flightNumber,
          tripType: input.tripType,
          status: input.status,
          paymentStatus: input.paymentStatus,
          paymentMethod: input.paymentMethod,
          source: input.source,
          amount: total,
          assignedDriverId: input.assignedDriverId,
          notes: input.notes?.trim() || undefined,
          createdAt,
        };

        set((currentState) => {
          const nextClients = createdClient
            ? [createdClient, ...currentState.clients]
            : currentState.clients;

          const updatedClients = nextClients.map((client) =>
            client.id === clientId
              ? {
                  ...client,
                  bookingCount: client.bookingCount + 1,
                  totalSpend: client.totalSpend + total,
                  loyaltyPoints: client.loyaltyPoints + Math.max(20, Math.round(total / 50)),
                  outstandingBalance:
                    input.paymentStatus === "Paid"
                      ? 0
                      : (client.outstandingBalance ?? 0) + total,
                }
              : client,
          );

          return {
            bookings: [booking, ...currentState.bookings],
            clients: updatedClients,
            drivers: currentState.drivers.map((driver) =>
              input.assignedDriverId && driver.id === input.assignedDriverId
                ? { ...driver, status: "On Trip", currentAssignment: ref }
                : driver,
            ),
            vehicles: currentState.vehicles.map((item) =>
              item.id === input.vehicleId
                ? {
                    ...item,
                    status:
                      input.status === "Active"
                        ? "On Hire"
                        : input.status === "Cancelled"
                          ? item.status
                          : "On Request",
                    currentCity: input.pickupCity,
                    nextBookingDate: input.pickupDate,
                  }
                : item,
            ),
          };
        });

        return { ref, total };
      },

      addVehicle: (input) => {
        const existingSlugs = get().vehicles.map((vehicle) => vehicle.slug);
        const slug = ensureUniqueSlug(slugify(input.name), existingSlugs);
        const baseDailyRate = Number(input.baseDailyRate);
        const vehicle: Vehicle = {
          id: buildVehicleId(),
          slug,
          name: input.name.trim(),
          make: input.make.trim(),
          model: input.model.trim(),
          year: Number(input.year),
          regPlate: input.regPlate.trim().toUpperCase(),
          vin: `VIN-${Math.random().toString(36).slice(2, 12).toUpperCase()}`,
          color: input.color.trim(),
          category: input.category,
          transmission: input.transmission,
          fuel: input.fuel.trim(),
          seats: Number(input.seats),
          doors: Number(input.doors),
          ac: true,
          mileagePolicy: input.mileagePolicy.trim(),
          insuranceIncluded: input.insuranceIncluded.trim(),
          baseDailyRate,
          weeklyRate: input.weeklyRate ?? Math.round(baseDailyRate * 6.2),
          monthlyRate: input.monthlyRate ?? Math.round(baseDailyRate * 24),
          chauffeurRate: input.chauffeurRate ?? get().adminSettings.pricingRules.defaultChauffeurRate,
          cityRates: Object.fromEntries(
            input.cities.map((city) => [city, baseDailyRate]),
          ),
          rating: 4.9,
          reviewCount: 0,
          featured: false,
          popular: false,
          newest: true,
          withDriverAvailable: input.withDriverAvailable,
          cities: input.cities,
          status: input.status,
          currentCity: input.currentCity,
          nextBookingDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 10),
          mainImage: input.mainImage.trim(),
          gallery: [input.mainImage.trim()],
          description: input.description.trim(),
          features: input.features,
          services: createVehicleServices(input),
          heroMetric: input.withDriverAvailable
            ? "Configured for premium managed mobility"
            : "Configured for fast self-drive turnaround",
        };

        set((state) => ({
          vehicles: [vehicle, ...state.vehicles],
        }));

        return vehicle;
      },

      updateBookingStatus: (ref, status) =>
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.ref === ref ? { ...booking, status } : booking,
          ),
        })),

      updatePaymentStatus: (ref, paymentStatus, paymentMethod) =>
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.ref === ref
              ? {
                  ...booking,
                  paymentStatus,
                  paymentMethod: paymentMethod ?? booking.paymentMethod,
                }
              : booking,
          ),
        })),

      assignDriver: (ref, driverId) =>
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.ref === ref ? { ...booking, assignedDriverId: driverId } : booking,
          ),
          drivers: state.drivers.map((driver) =>
            driver.id === driverId
              ? { ...driver, status: "On Trip", currentAssignment: ref }
              : driver,
          ),
        })),

      updateDriverStatus: (driverId, status) =>
        set((state) => ({
          drivers: state.drivers.map((driver) =>
            driver.id === driverId
              ? {
                  ...driver,
                  status,
                  currentAssignment:
                    status === "Available"
                      ? "Ready for next dispatch"
                      : status === "Off Duty"
                        ? "Available tomorrow from 06:00"
                        : driver.currentAssignment,
                }
              : driver,
          ),
        })),

      updateVehicleStatus: (vehicleId, status) =>
        set((state) => ({
          vehicles: state.vehicles.map((vehicle) =>
            vehicle.id === vehicleId ? { ...vehicle, status } : vehicle,
          ),
        })),

      saveAdminSettings: (settings) =>
        set({
          adminSettings: settings,
        }),
    }),
    {
      name: "shark-car-hire-store",
      partialize: (state) => ({
        vehicles: state.vehicles,
        clients: state.clients,
        drivers: state.drivers,
        bookings: state.bookings,
        bookingDraft: state.bookingDraft,
        customerSessionId: state.customerSessionId,
        adminRole: state.adminRole,
        adminSettings: state.adminSettings,
      }),
    },
  ),
);

export function getAvailableExtras(draft: BookingDraft) {
  return bookingExtras.filter((extra) => {
    if (extra.conditional === "always") return true;
    if (extra.conditional === "airport") {
      return draft.pickupLocation.toLowerCase().includes("airport");
    }
    if (extra.conditional === "self-drive") {
      return !draft.withDriver;
    }
    return true;
  });
}
