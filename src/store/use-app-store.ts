import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  bookingExtras,
  clients as initialClients,
  drivers as initialDrivers,
  initialBookings,
  vehicles as initialVehicles,
} from "@/data/mock";
import { calculateBookingTotal } from "@/lib/booking";
import type {
  AdminRole,
  Booking,
  BookingDraft,
  BookingStatus,
  Client,
  Driver,
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

type Store = {
  vehicles: Vehicle[];
  clients: Client[];
  drivers: Driver[];
  bookings: Booking[];
  bookingDraft: BookingDraft;
  customerSessionId: string | null;
  adminRole: AdminRole | null;
  updateDraft: (partial: Partial<BookingDraft>) => void;
  updateDraftCustomer: (partial: Partial<BookingDraft["customer"]>) => void;
  setDraftVehicle: (vehicleId: string) => void;
  toggleDraftExtra: (extraId: string) => void;
  resetDraft: () => void;
  setCustomerSession: (clientId: string | null) => void;
  setAdminRole: (role: AdminRole | null) => void;
  submitBooking: () => { ref: string; total: number };
  updateBookingStatus: (ref: string, status: BookingStatus) => void;
  updatePaymentStatus: (
    ref: string,
    paymentStatus: PaymentStatus,
    paymentMethod?: PaymentMethod,
  ) => void;
  assignDriver: (ref: string, driverId: string) => void;
  updateVehicleStatus: (vehicleId: string, status: VehicleStatus) => void;
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
      adminRole: "Super Admin",

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

      submitBooking: () => {
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
        const ref = createRef();
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
          status:
            state.bookingDraft.paymentMethod === "Bank Transfer"
              ? "Pending"
              : "Confirmed",
          paymentStatus:
            state.bookingDraft.paymentMethod === "Bank Transfer"
              ? "Pending Payment"
              : "Paid",
          paymentMethod: state.bookingDraft.paymentMethod,
          source: "Online",
          amount: total,
          createdAt: new Date().toISOString(),
          notes: state.bookingDraft.customer.specialRequests || undefined,
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

      updateVehicleStatus: (vehicleId, status) =>
        set((state) => ({
          vehicles: state.vehicles.map((vehicle) =>
            vehicle.id === vehicleId ? { ...vehicle, status } : vehicle,
          ),
        })),
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
