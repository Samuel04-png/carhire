import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CalendarRange, ExternalLink, FileBarChart, Phone, Plus, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AdminShell } from "@/components/admin/AdminShell";
import { bookingSourceOptions, bookingStatusOptions, paymentMethodOptions, paymentStatusOptions } from "@/components/admin/admin-constants";
import {
  EmptyState,
  InfoBlock,
  MetricCard,
  StatusPill,
  SummaryRow,
  SurfaceCard,
  TextField,
  bookingStatusTone,
  inputClassName,
  offsetDate,
  paymentStatusTone,
  textareaClassName,
  toPhoneHref,
} from "@/components/admin/AdminUi";
import { Button } from "@/components/ui/button";
import { bookingExtras } from "@/data/mock";
import { cities } from "@/data/site";
import { calculateBookingTotal } from "@/lib/booking";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { useAppStore } from "@/store/use-app-store";
import type { AdminBookingInput, BookingDraft, BookingSource, BookingStatus, City, PaymentMethod, PaymentStatus } from "@/types";

export function AdminBookingsScreen({ createMode = false }: { createMode?: boolean }) {
  const navigate = useNavigate();
  const bookings = useAppStore((state) => state.bookings);
  const clients = useAppStore((state) => state.clients);
  const vehicles = useAppStore((state) => state.vehicles);
  const drivers = useAppStore((state) => state.drivers);
  const updateBookingStatus = useAppStore((state) => state.updateBookingStatus);
  const updatePaymentStatus = useAppStore((state) => state.updatePaymentStatus);
  const assignDriver = useAppStore((state) => state.assignDriver);
  const createAdminBooking = useAppStore((state) => state.createAdminBooking);
  const adminSettings = useAppStore((state) => state.adminSettings);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "All">("All");
  const [cityFilter, setCityFilter] = useState<City | "All">("All");

  const filteredBookings = bookings.filter((booking) => {
    const client = clients.find((item) => item.id === booking.clientId);
    const vehicle = vehicles.find((item) => item.id === booking.vehicleId);
    const haystack = `${booking.ref} ${client?.firstName ?? ""} ${client?.lastName ?? ""} ${vehicle?.name ?? ""}`.toLowerCase();
    if (query && !haystack.includes(query.trim().toLowerCase())) return false;
    if (statusFilter !== "All" && booking.status !== statusFilter) return false;
    if (cityFilter !== "All" && booking.pickupCity !== cityFilter) return false;
    return true;
  });

  const defaultVehicle = vehicles.find((vehicle) => vehicle.status !== "Retired");
  const [clientMode, setClientMode] = useState<"existing" | "new">(clients.length > 0 ? "existing" : "new");
  const [form, setForm] = useState({
    clientId: clients[0]?.id ?? "",
    firstName: clients[0]?.firstName ?? "",
    lastName: clients[0]?.lastName ?? "",
    email: clients[0]?.email ?? "",
    phone: clients[0]?.phone ?? "",
    accountType: (clients[0]?.accountType ?? "Individual") as "Individual" | "Corporate",
    companyName: clients[0]?.companyName ?? "",
    vehicleId: defaultVehicle?.id ?? "",
    pickupCity: (defaultVehicle?.currentCity ?? "Lusaka") as City,
    pickupLocation: "Kenneth Kaunda International Airport",
    pickupDate: offsetDate(1),
    pickupTime: "10:00",
    returnDate: offsetDate(2),
    returnTime: "10:00",
    withDriver: true,
    extras: [] as string[],
    paymentMethod: "Bank Transfer" as PaymentMethod,
    paymentStatus: "Pending Payment" as PaymentStatus,
    status: "Confirmed" as BookingStatus,
    source: "Phone" as BookingSource,
    assignedDriverId: "",
    notes: "",
    flightNumber: "",
  });

  useEffect(() => {
    const selectedClient = clients.find((client) => client.id === form.clientId);
    if (clientMode === "existing" && selectedClient) {
      setForm((current) => ({
        ...current,
        firstName: selectedClient.firstName,
        lastName: selectedClient.lastName,
        email: selectedClient.email,
        phone: selectedClient.phone,
        accountType: selectedClient.accountType,
        companyName: selectedClient.companyName ?? "",
      }));
    }
  }, [clientMode, clients, form.clientId]);

  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === form.vehicleId) ?? null;
  const availableDrivers = drivers.filter((driver) => driver.city === form.pickupCity || driver.id === form.assignedDriverId);
  const availableExtras = bookingExtras.filter((extra) => {
    if (extra.conditional === "always") return true;
    if (extra.conditional === "airport") return form.pickupLocation.toLowerCase().includes("airport");
    if (extra.conditional === "self-drive") return !form.withDriver;
    return true;
  });

  const pricingDraft: BookingDraft = {
    vehicleId: form.vehicleId,
    pickupCity: form.pickupCity,
    pickupLocation: form.pickupLocation,
    customAddress: "",
    pickupDate: form.pickupDate,
    pickupTime: form.pickupTime,
    returnDate: form.returnDate,
    returnTime: form.returnTime,
    withDriver: form.withDriver,
    flightNumber: form.flightNumber,
    tripType: "Arrival",
    extras: form.extras,
    customer: {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      countryCode: "+260",
      phone: form.phone,
      idNumber: "",
      licenseNumber: "",
      licenseExpiry: "",
      specialRequests: form.notes,
      createAccount: false,
      password: "",
      confirmPassword: "",
      privacyAccepted: true,
    },
    paymentMethod: form.paymentMethod,
    mobileMoneyNetwork: "MTN",
  };
  const projectedTotal = selectedVehicle ? calculateBookingTotal(pricingDraft, selectedVehicle) : 0;

  const updateField = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const toggleExtra = (extraId: string) => {
    setForm((current) => ({
      ...current,
      extras: current.extras.includes(extraId)
        ? current.extras.filter((item) => item !== extraId)
        : [...current.extras, extraId],
    }));
  };

  const submit = (mode: "draft" | "confirm") => {
    if (!form.vehicleId || !form.pickupLocation.trim() || !form.pickupDate || !form.returnDate) {
      toast.error("Complete the booking details before saving.");
      return;
    }
    if (clientMode === "existing" && !form.clientId) {
      toast.error("Select an existing client or switch to new client.");
      return;
    }
    if (clientMode === "new" && (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.phone.trim())) {
      toast.error("New client details are incomplete.");
      return;
    }

    const payload: AdminBookingInput = {
      clientId: clientMode === "existing" ? form.clientId : undefined,
      customer: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        accountType: form.accountType,
        companyName: form.accountType === "Corporate" ? form.companyName : undefined,
      },
      vehicleId: form.vehicleId,
      pickupCity: form.pickupCity,
      pickupLocation: form.pickupLocation,
      pickupDate: form.pickupDate,
      pickupTime: form.pickupTime,
      returnDate: form.returnDate,
      returnTime: form.returnTime,
      withDriver: form.withDriver,
      extras: form.extras,
      flightNumber: form.flightNumber || undefined,
      status: mode === "draft" ? "Pending" : form.status,
      paymentStatus: mode === "draft" ? "Pending Payment" : form.paymentStatus,
      paymentMethod: form.paymentMethod,
      source: form.source,
      assignedDriverId: form.assignedDriverId || undefined,
      notes: form.notes || undefined,
    };

    const result = createAdminBooking(payload);
    toast.success(mode === "draft" ? `Draft booking ${result.ref} saved.` : `Booking ${result.ref} created.`);
    navigate("/admin/bookings");
  };

  if (createMode) {
    return (
      <AdminShell
        title="New Booking"
        description="Create a reservation, client record, and dispatch-ready booking from one admin flow."
        actions={<Button type="button" variant="secondary" className="rounded-full" onClick={() => navigate("/admin/bookings")}>Back to Bookings</Button>}
      >
        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <SurfaceCard title="Booking intake" subtitle="Manual reservations update live booking state immediately.">
            <div className="space-y-8">
              <section>
                <div className="mb-4 flex flex-wrap gap-2">
                  <button type="button" className={`rounded-full px-4 py-2 text-sm font-medium ${clientMode === "existing" ? "bg-[var(--color-accent)] text-white" : "border border-[var(--color-gray-200)] bg-white text-[var(--color-gray-600)]"}`} onClick={() => setClientMode("existing")}>Existing client</button>
                  <button type="button" className={`rounded-full px-4 py-2 text-sm font-medium ${clientMode === "new" ? "bg-[var(--color-accent)] text-white" : "border border-[var(--color-gray-200)] bg-white text-[var(--color-gray-600)]"}`} onClick={() => setClientMode("new")}>New client</button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {clientMode === "existing" && (
                    <label className="md:col-span-2">
                      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">Client</div>
                      <select className={inputClassName} value={form.clientId} onChange={(event) => updateField("clientId", event.target.value)}>
                        {clients.map((client) => (
                          <option key={client.id} value={client.id}>{client.firstName} {client.lastName} � {client.accountType}</option>
                        ))}
                      </select>
                    </label>
                  )}
                  <TextField label="First name" value={form.firstName} onChange={(value) => updateField("firstName", value)} />
                  <TextField label="Last name" value={form.lastName} onChange={(value) => updateField("lastName", value)} />
                  <TextField label="Email" value={form.email} onChange={(value) => updateField("email", value)} />
                  <TextField label="Phone" value={form.phone} onChange={(value) => updateField("phone", value)} />
                  <label>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">Account type</div>
                    <select className={inputClassName} value={form.accountType} onChange={(event) => updateField("accountType", event.target.value as "Individual" | "Corporate")}>
                      <option>Individual</option>
                      <option>Corporate</option>
                    </select>
                  </label>
                  <TextField label="Company" value={form.companyName} disabled={form.accountType !== "Corporate"} onChange={(value) => updateField("companyName", value)} />
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-2">
                <label>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">Vehicle</div>
                  <select className={inputClassName} value={form.vehicleId} onChange={(event) => updateField("vehicleId", event.target.value)}>
                    {vehicles.filter((vehicle) => vehicle.status !== "Retired").map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>{vehicle.name} � {vehicle.currentCity}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">Pickup city</div>
                  <select className={inputClassName} value={form.pickupCity} onChange={(event) => updateField("pickupCity", event.target.value as City)}>
                    {cities.map((city) => <option key={city}>{city}</option>)}
                  </select>
                </label>
                <TextField label="Pickup location" value={form.pickupLocation} onChange={(value) => updateField("pickupLocation", value)} />
                <label>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">Assigned driver</div>
                  <select className={inputClassName} value={form.assignedDriverId} onChange={(event) => updateField("assignedDriverId", event.target.value)}>
                    <option value="">Assign later</option>
                    {availableDrivers.map((driver) => <option key={driver.id} value={driver.id}>{driver.name} � {driver.status}</option>)}
                  </select>
                </label>
                <TextField label="Pickup date" type="date" value={form.pickupDate} onChange={(value) => updateField("pickupDate", value)} />
                <TextField label="Pickup time" type="time" value={form.pickupTime} onChange={(value) => updateField("pickupTime", value)} />
                <TextField label="Return date" type="date" value={form.returnDate} onChange={(value) => updateField("returnDate", value)} />
                <TextField label="Return time" type="time" value={form.returnTime} onChange={(value) => updateField("returnTime", value)} />
                <label className="md:col-span-2 flex items-center justify-between rounded-[24px] border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-4 py-4">
                  <div>
                    <div className="text-sm font-semibold text-[var(--color-primary)]">Chauffeur required</div>
                    <div className="mt-1 text-sm text-[var(--color-gray-600)]">Toggle managed driver service for this booking.</div>
                  </div>
                  <input type="checkbox" checked={form.withDriver} onChange={(event) => updateField("withDriver", event.target.checked)} />
                </label>
                <TextField label="Flight number" value={form.flightNumber} onChange={(value) => updateField("flightNumber", value)} />
                <label>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">Booking source</div>
                  <select className={inputClassName} value={form.source} onChange={(event) => updateField("source", event.target.value as BookingSource)}>
                    {bookingSourceOptions.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </label>
              </section>

              <section>
                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">Extras</div>
                <div className="grid gap-3 md:grid-cols-2">
                  {availableExtras.map((extra) => {
                    const selected = form.extras.includes(extra.id);
                    return (
                      <button key={extra.id} type="button" onClick={() => toggleExtra(extra.id)} className={`rounded-[24px] border px-4 py-4 text-left transition ${selected ? "border-[var(--color-accent)] bg-[rgba(26,127,212,0.08)]" : "border-[var(--color-gray-200)] bg-white"}`}>
                        <div className="font-semibold text-[var(--color-primary)]">{extra.title}</div>
                        <div className="mt-2 text-sm text-[var(--color-gray-600)]">{extra.description}</div>
                        <div className="mt-3 text-xs uppercase tracking-[0.22em] text-[var(--color-gray-500)]">{extra.pricing === "daily" ? `${formatCurrency(extra.price)} / day` : formatCurrency(extra.price)}</div>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-3">
                <label>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">Booking status</div>
                  <select className={inputClassName} value={form.status} onChange={(event) => updateField("status", event.target.value as BookingStatus)}>
                    {bookingStatusOptions.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </label>
                <label>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">Payment method</div>
                  <select className={inputClassName} value={form.paymentMethod} onChange={(event) => updateField("paymentMethod", event.target.value as PaymentMethod)}>
                    {paymentMethodOptions.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </label>
                <label>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">Payment status</div>
                  <select className={inputClassName} value={form.paymentStatus} onChange={(event) => updateField("paymentStatus", event.target.value as PaymentStatus)}>
                    {paymentStatusOptions.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </label>
                <label className="md:col-span-3">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">Internal notes</div>
                  <textarea className={textareaClassName} value={form.notes} onChange={(event) => updateField("notes", event.target.value)} />
                </label>
              </section>

              <div className="flex flex-wrap gap-3">
                <Button type="button" className="rounded-full" onClick={() => submit("confirm")}>Confirm Booking</Button>
                <Button type="button" variant="secondary" className="rounded-full" onClick={() => submit("draft")}>Save Draft</Button>
              </div>
            </div>
          </SurfaceCard>

          <div className="space-y-6">
            <SurfaceCard title="Booking preview" subtitle="Projected commercial value from the current admin draft.">
              <div className="space-y-4">
                <SummaryRow label="Vehicle" value={selectedVehicle?.name ?? "Select a vehicle"} />
                <SummaryRow label="Client" value={`${form.firstName || "-"} ${form.lastName || ""}`.trim() || "Select or create client"} />
                <SummaryRow label="Pickup" value={`${form.pickupCity} � ${form.pickupDate} ${form.pickupTime}`} />
                <SummaryRow label="Return" value={`${form.returnDate} ${form.returnTime}`} />
                <SummaryRow label="With driver" value={form.withDriver ? "Yes" : "No"} />
                <div className="rounded-[24px] bg-[var(--color-primary)] p-5 text-white">
                  <div className="text-xs uppercase tracking-[0.22em] text-white/45">Projected total</div>
                  <div className="mt-3 font-display text-4xl font-bold tracking-[-0.05em]">{formatCurrency(projectedTotal)}</div>
                </div>
              </div>
            </SurfaceCard>
            <SurfaceCard title="Operational defaults" subtitle="Current admin rules affecting manual booking intake.">
              <div className="space-y-4 text-sm text-[var(--color-gray-600)]">
                <SummaryRow label="Self-drive lead time" value={`${adminSettings.bookingRules.selfDriveLeadHours} hours`} />
                <SummaryRow label="Chauffeur lead time" value={`${adminSettings.bookingRules.chauffeurLeadHours} hours`} />
                <SummaryRow label="Security deposit" value={formatCurrency(adminSettings.pricingRules.securityDeposit)} />
                <SummaryRow label="Settlement terms" value={adminSettings.paymentSettings.settlementTerms} />
              </div>
            </SurfaceCard>
          </div>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Bookings" description="Search reservations, update status, collect payment state, assign drivers, and jump into the client-facing confirmation page." actions={<Button asChild className="rounded-full"><Link to="/admin/bookings/new"><Plus className="mr-2 h-4 w-4" />New Booking</Link></Button>}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total bookings" value={String(bookings.length)} icon={CalendarRange} accent="blue" />
        <MetricCard label="Pending" value={String(bookings.filter((item) => item.status === "Pending").length)} icon={CalendarRange} accent="amber" />
        <MetricCard label="Active hires" value={String(bookings.filter((item) => item.status === "Active").length)} icon={CalendarRange} accent="navy" />
        <MetricCard label="Awaiting payment" value={String(bookings.filter((item) => item.paymentStatus !== "Paid").length)} icon={FileBarChart} accent="green" />
      </div>

      <SurfaceCard className="mt-6" title="Find a booking" subtitle="Use status and city filters to focus the queue.">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-gray-500)]" />
            <input className={`${inputClassName} pl-11`} placeholder="Search by ref, client, or vehicle" value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <select className={inputClassName} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as BookingStatus | "All")}>
            <option value="All">All statuses</option>
            {bookingStatusOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
          <select className={inputClassName} value={cityFilter} onChange={(event) => setCityFilter(event.target.value as City | "All")}>
            <option value="All">All cities</option>
            {cities.map((city) => <option key={city}>{city}</option>)}
          </select>
        </div>
      </SurfaceCard>

      <div className="mt-6 space-y-4">
        {filteredBookings.map((booking) => {
          const vehicle = vehicles.find((item) => item.id === booking.vehicleId);
          const client = clients.find((item) => item.id === booking.clientId);
          return (
            <div key={booking.ref} className="rounded-[30px] border border-[var(--color-gray-200)] bg-white p-5 shadow-[0_18px_60px_rgba(10,22,40,0.06)]">
              <div className="grid gap-5 2xl:grid-cols-[1.3fr_0.75fr_0.75fr_0.95fr_0.95fr_0.9fr]">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="font-semibold text-[var(--color-primary)]">{booking.ref}</div>
                    <StatusPill label={booking.status} tone={bookingStatusTone(booking.status)} />
                    <StatusPill label={booking.paymentStatus} tone={paymentStatusTone(booking.paymentStatus)} />
                  </div>
                  <div className="mt-3 text-sm text-[var(--color-gray-600)]">{client?.firstName} {client?.lastName} � {vehicle?.name}</div>
                  <div className="mt-1 text-sm text-[var(--color-gray-600)]">{booking.pickupLocation}</div>
                  <div className="mt-2 text-xs uppercase tracking-[0.22em] text-[var(--color-gray-500)]">{formatDateTime(booking.pickupDateTime)} to {formatDateTime(booking.returnDateTime)}</div>
                </div>
                <InfoBlock label="City" value={booking.pickupCity} subvalue={booking.source} />
                <InfoBlock label="Amount" value={formatCurrency(booking.amount)} subvalue={booking.paymentMethod} />
                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">Booking status</div>
                  <select className={inputClassName} value={booking.status} onChange={(event) => updateBookingStatus(booking.ref, event.target.value as BookingStatus)}>
                    {bookingStatusOptions.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">Payment status</div>
                  <select className={inputClassName} value={booking.paymentStatus} onChange={(event) => updatePaymentStatus(booking.ref, event.target.value as PaymentStatus)}>
                    {paymentStatusOptions.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">Actions</div>
                  <select className={inputClassName} value={booking.assignedDriverId ?? ""} onChange={(event) => event.target.value && assignDriver(booking.ref, event.target.value)}>
                    <option value="">Assign driver</option>
                    {drivers.map((driver) => <option key={driver.id} value={driver.id}>{driver.name}</option>)}
                  </select>
                  <div className="flex flex-wrap gap-2">
                    {client?.phone && <Button asChild size="sm" variant="secondary" className="rounded-full"><a href={toPhoneHref(client.phone)}><Phone className="mr-2 h-4 w-4" />Call</a></Button>}
                    <Button asChild size="sm" className="rounded-full"><Link to={`/booking/confirmation/${booking.ref}`}><ExternalLink className="mr-2 h-4 w-4" />Open</Link></Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filteredBookings.length === 0 && <EmptyState title="No bookings matched those filters" description="Clear the search or open a new reservation from the admin booking flow." action={<Button asChild className="rounded-full"><Link to="/admin/bookings/new">Create Booking</Link></Button>} />}
      </div>
    </AdminShell>
  );
}
