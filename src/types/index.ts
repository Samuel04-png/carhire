export type City = "Lusaka" | "Kitwe" | "Ndola";
export type VehicleCategory =
  | "Economy"
  | "Saloon"
  | "SUV"
  | "Minibus"
  | "Luxury"
  | "Pickup";
export type Transmission = "Manual" | "Automatic";
export type VehicleStatus = "Available" | "On Hire" | "Maintenance" | "Retired" | "On Request";
export type BookingStatus = "Pending" | "Confirmed" | "Active" | "Completed" | "Cancelled";
export type PaymentStatus = "Pending Payment" | "Paid" | "Partial" | "Refunded";
export type BookingSource = "Online" | "Phone" | "Walk-in" | "WhatsApp" | "Corporate Account" | "Referral";
export type LoyaltyTier = "Standard" | "Silver" | "Gold" | "Platinum";
export type DriverStatus = "Available" | "On Trip" | "Off Duty" | "Suspended";
export type AdminRole = "Super Admin" | "Operations Manager" | "Booking Agent" | "Driver" | "Accountant";
export type PaymentMethod =
  | "MTN Mobile Money"
  | "Airtel Money"
  | "Zamtel Money"
  | "Bank Transfer"
  | "Credit / Debit Card"
  | "Pay on Pickup";

export interface AdminSettings {
  companyProfile: {
    companyName: string;
    tagline: string;
    supportPhone: string;
    supportEmail: string;
    whatsappUrl: string;
    officeAddress: string;
  };
  bookingRules: {
    selfDriveLeadHours: number;
    chauffeurLeadHours: number;
    holdWindowHours: number;
    taxRate: number;
    defaultPickupWindow: string;
  };
  pricingRules: {
    airportMeetAndGreetFee: number;
    defaultChauffeurRate: number;
    securityDeposit: number;
    corporateDiscountPercent: number;
    lowAvailabilityThreshold: number;
  };
  notifications: {
    bookingConfirmationTemplate: string;
    paymentReminderTemplate: string;
    dispatchTemplate: string;
  };
  paymentSettings: {
    mobileMoneyEnabled: boolean;
    bankTransferEnabled: boolean;
    cardEnabled: boolean;
    payOnPickupEnabled: boolean;
    settlementTerms: string;
  };
  cms: {
    heroHeadline: string;
    heroSubheadline: string;
    corporateBannerTitle: string;
    trustBadgeLabel: string;
  };
}

export interface Vehicle {
  id: string;
  slug: string;
  name: string;
  make: string;
  model: string;
  year: number;
  regPlate: string;
  vin: string;
  color: string;
  category: VehicleCategory;
  transmission: Transmission;
  fuel: string;
  seats: number;
  doors: number;
  ac: boolean;
  mileagePolicy: string;
  insuranceIncluded: string;
  baseDailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  chauffeurRate: number;
  cityRates?: Partial<Record<City, number>>;
  rating: number;
  reviewCount: number;
  featured: boolean;
  popular: boolean;
  newest: boolean;
  withDriverAvailable: boolean;
  cities: City[];
  status: VehicleStatus;
  currentCity: City;
  nextBookingDate: string;
  mainImage: string;
  gallery: string[];
  description: string;
  features: string[];
  services: string[];
  heroMetric: string;
}

export interface Service {
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  heroImage: string;
  icon: string;
  accentLabel: string;
  primaryCta: string;
  ctaHref: string;
  includes: string[];
  process: string[];
  pricingNote: string;
  faq: Array<{ question: string; answer: string }>;
  testimonialIds: string[];
  vehicleCategories: VehicleCategory[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
}

export interface LocationOffice {
  city: City;
  label: string;
  address: string;
  phone: string;
  hours: string;
  mapEmbed: string;
  directionsUrl: string;
  summary: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string[];
  publishedAt: string;
  readTime: string;
  image: string;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: City;
  tier: LoyaltyTier;
  bookingCount: number;
  totalSpend: number;
  loyaltyPoints: number;
  memberSince: string;
  accountType: "Individual" | "Corporate";
  idNumber: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  savedAddresses: string[];
  preferences: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    promotions: boolean;
  };
  companyName?: string;
  outstandingBalance?: number;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: City;
  status: DriverStatus;
  currentAssignment: string;
  rating: number;
  licenseNumber: string;
  licenseExpiry: string;
  vehiclePreferences: VehicleCategory[];
}

export interface BookingExtra {
  id: string;
  title: string;
  description: string;
  price: number;
  pricing: "flat" | "daily";
  conditional?: "airport" | "self-drive" | "always";
}

export interface Booking {
  ref: string;
  vehicleId: string;
  clientId: string;
  pickupCity: City;
  pickupLocation: string;
  pickupDateTime: string;
  returnDateTime: string;
  withDriver: boolean;
  extras: string[];
  flightNumber?: string;
  tripType?: "Arrival" | "Departure";
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  source: BookingSource;
  amount: number;
  paymentReferenceId?: string;
  assignedDriverId?: string;
  notes?: string;
  createdAt: string;
}

export interface AdminBookingInput {
  clientId?: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    accountType: "Individual" | "Corporate";
    companyName?: string;
  };
  vehicleId: string;
  pickupCity: City;
  pickupLocation: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  withDriver: boolean;
  extras: string[];
  flightNumber?: string;
  tripType?: "Arrival" | "Departure";
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  source: BookingSource;
  assignedDriverId?: string;
  notes?: string;
}

export interface AdminVehicleInput {
  name: string;
  make: string;
  model: string;
  year: number;
  regPlate: string;
  color: string;
  category: VehicleCategory;
  transmission: Transmission;
  fuel: string;
  seats: number;
  doors: number;
  baseDailyRate: number;
  weeklyRate?: number;
  monthlyRate?: number;
  chauffeurRate?: number;
  currentCity: City;
  cities: City[];
  status: VehicleStatus;
  mainImage: string;
  description: string;
  withDriverAvailable: boolean;
  mileagePolicy: string;
  insuranceIncluded: string;
  features: string[];
}

export interface BookingDraft {
  vehicleId: string | null;
  pickupCity: City;
  pickupLocation: string;
  customAddress: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  withDriver: boolean;
  flightNumber: string;
  tripType: "Arrival" | "Departure";
  extras: string[];
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    countryCode: string;
    phone: string;
    idNumber: string;
    licenseNumber: string;
    licenseExpiry: string;
    specialRequests: string;
    createAccount: boolean;
    password: string;
    confirmPassword: string;
    privacyAccepted: boolean;
  };
  paymentMethod: PaymentMethod;
  mobileMoneyNetwork: "MTN" | "Airtel" | "Zamtel";
}

export interface FleetFilters {
  category: VehicleCategory | "All";
  transmission: Transmission | "Any";
  seats: "Any" | "2-4" | "5" | "6-7" | "8+";
  driverMode: "Any" | "Self-Drive" | "Chauffeur";
  city: City | "All";
  minPrice: number;
  maxPrice: number;
  sort: "Most Popular" | "Newest" | "Price Low-High" | "Price High-Low";
  search: string;
}
