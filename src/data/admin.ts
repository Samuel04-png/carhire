import { company } from "@/data/site";
import type { AdminRole, AdminSettings } from "@/types";

export const demoAdminPassword = "password123";

export const adminAccessProfiles: Array<{
  role: Exclude<AdminRole, "Driver">;
  email: string;
  summary: string;
}> = [
  {
    role: "Super Admin",
    email: "admin@sharkcarhire.com",
    summary: "Full operational, financial, and content access.",
  },
  {
    role: "Operations Manager",
    email: "ops@sharkcarhire.com",
    summary: "Bookings, fleet deployment, dispatch, and service oversight.",
  },
  {
    role: "Booking Agent",
    email: "desk@sharkcarhire.com",
    summary: "Reservation intake, client support, and payment follow-up.",
  },
  {
    role: "Accountant",
    email: "finance@sharkcarhire.com",
    summary: "Revenue, payment status, and settlement reporting.",
  },
];

export const initialAdminSettings: AdminSettings = {
  companyProfile: {
    companyName: company.name,
    tagline: company.tagline,
    supportPhone: company.phone,
    supportEmail: company.email,
    whatsappUrl: company.whatsapp,
    officeAddress: company.address,
  },
  bookingRules: {
    selfDriveLeadHours: 4,
    chauffeurLeadHours: 2,
    holdWindowHours: 12,
    taxRate: 8,
    defaultPickupWindow: "06:00 - 22:00",
  },
  pricingRules: {
    airportMeetAndGreetFee: 280,
    defaultChauffeurRate: 700,
    securityDeposit: 5000,
    corporateDiscountPercent: 8,
    lowAvailabilityThreshold: 3,
  },
  notifications: {
    bookingConfirmationTemplate:
      "Your booking is confirmed. Our operations team will contact you with final handover details.",
    paymentReminderTemplate:
      "Payment is still pending on this booking. Kindly settle to keep the reservation priority in place.",
    dispatchTemplate:
      "Your driver has been assigned and will share arrival details shortly before pickup.",
  },
  paymentSettings: {
    mobileMoneyEnabled: true,
    bankTransferEnabled: true,
    cardEnabled: true,
    payOnPickupEnabled: true,
    settlementTerms: "Corporate accounts: 7 days from invoice date.",
  },
  cms: {
    heroHeadline: "Premium mobility across Zambia's key business cities.",
    heroSubheadline:
      "Self-drive, chauffeur, airport, event, and corporate mobility with operational discipline behind every booking.",
    corporateBannerTitle: "Dedicated fleet. Monthly invoicing. Priority service.",
    trustBadgeLabel: "Trusted by business teams and private clients.",
  },
};
