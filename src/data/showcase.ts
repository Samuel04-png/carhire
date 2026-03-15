import { bookingExtras } from "@/data/operations";
import { services } from "@/data/services";
import { vehicles } from "@/data/vehicles";
import type { City, VehicleCategory } from "@/types";

export type PublicGalleryCollection =
  | "Fleet"
  | "Airport"
  | "Corporate"
  | "Weddings"
  | "Events";

export type GalleryAssetSize = "standard" | "tall" | "wide";

export type GalleryAsset = {
  id: string;
  title: string;
  caption: string;
  image: string;
  collection: PublicGalleryCollection;
  city: City;
  href: string;
  ctaLabel: string;
  size: GalleryAssetSize;
};

export const pricingCategoryOrder: VehicleCategory[] = [
  "Economy",
  "Saloon",
  "SUV",
  "Pickup",
  "Luxury",
  "Minibus",
];

export const pricingPrinciples = [
  {
    title: "City-based day rates",
    description:
      "Rates are shown against the operating city so Lusaka, Kitwe, and Ndola availability stays transparent.",
  },
  {
    title: "Weekly and monthly savings",
    description:
      "Longer bookings reduce the day-rate pressure and make repeat business travel easier to plan.",
  },
  {
    title: "Clear chauffeur separation",
    description:
      "Driver support is shown separately so self-drive and chauffeur jobs can be budgeted cleanly.",
  },
  {
    title: "Extras priced upfront",
    description:
      "Protection, airport meet-and-greet, child seats, GPS, and fuel options are visible before checkout.",
  },
] as const;

export const pricingFaq = [
  {
    question: "Are these final rates?",
    answer:
      "These public rates are guide prices for planning. Final quotes depend on exact city, dates, service mode, and confirmed extras.",
  },
  {
    question: "Do corporate clients receive account pricing?",
    answer:
      "Yes. Corporate accounts are quoted by usage pattern, contract term, and vehicle mix rather than a single public tariff.",
  },
  {
    question: "Is fuel included?",
    answer:
      "Fuel policy depends on the booking type. Self-drive and delivery arrangements are confirmed in the final booking summary.",
  },
  {
    question: "Can I mix chauffeur and self-drive bookings on one account?",
    answer:
      "Yes. Shark can run mixed booking types for authorised corporate users and project teams.",
  },
] as const;

const vehicleMap = new Map(vehicles.map((vehicle) => [vehicle.slug, vehicle]));
const serviceMap = new Map(services.map((service) => [service.slug, service]));

function getVehicle(slug: string) {
  const vehicle = vehicleMap.get(slug);
  if (!vehicle) {
    throw new Error(`Vehicle ${slug} was not found while building showcase data.`);
  }
  return vehicle;
}

function getService(slug: string) {
  const service = serviceMap.get(slug);
  if (!service) {
    throw new Error(`Service ${slug} was not found while building showcase data.`);
  }
  return service;
}

const corollaCross = getVehicle("toyota-corolla-cross");
const hilux = getVehicle("toyota-hilux-adventure");
const eClass = getVehicle("mercedes-e-class-signature");
const prado = getVehicle("toyota-prado-executive");
const quantum = getVehicle("toyota-quantum-shuttle");
const bmw = getVehicle("bmw-3-series-m-sport");
const corollaQuest = getVehicle("toyota-corolla-quest");

const airportTransfers = getService("airport-transfers");
const corporateHire = getService("corporate");
const weddingCars = getService("weddings");
const eventHire = getService("events");
const selfDrive = getService("self-drive");
const longTerm = getService("long-term");

export const serviceRateCards = [
  {
    title: airportTransfers.title,
    priceLabel: "From K950",
    note: "Arrival and departure transfer pricing varies by city, timing, and vehicle class.",
    href: "/services/airport-transfers",
    ctaLabel: "See Airport Service",
  },
  {
    title: corporateHire.title,
    priceLabel: "Account pricing",
    note: "Monthly invoicing, repeat routes, and fleet allocation are quoted to usage profile.",
    href: "/services/corporate",
    ctaLabel: "Open Corporate Account",
  },
  {
    title: weddingCars.title,
    priceLabel: "From K4,550",
    note: "Guide based on a luxury vehicle day rate with chauffeur support and standby planning.",
    href: "/services/weddings",
    ctaLabel: "Request Wedding Quote",
  },
  {
    title: eventHire.title,
    priceLabel: "Route-based quote",
    note: "Event budgets depend on vehicle count, hours, route complexity, and dispatch support.",
    href: "/services/events",
    ctaLabel: "Request Event Quote",
  },
  {
    title: selfDrive.title,
    priceLabel: "From K980 / day",
    note: "Best for independent city movement and planned multi-day travel.",
    href: "/services/self-drive",
    ctaLabel: "Browse Self-Drive",
  },
  {
    title: longTerm.title,
    priceLabel: "From K24,300 / month",
    note: "Long-term lease planning works best with a confirmed route profile and account contact.",
    href: "/services/long-term",
    ctaLabel: "Discuss Lease Terms",
  },
] as const;

export const pricingInclusions = [
  "Servicing and readiness checks before release",
  "Core insurance cover based on booking type",
  "Vehicle handover support and booking confirmation trail",
  "WhatsApp and phone assistance across the operating cities",
] as const;

export const pricingAddOns = bookingExtras.map((extra) => ({
  title: extra.title,
  description: extra.description,
  price: extra.price,
  pricing: extra.pricing,
  conditional: extra.conditional ?? "always",
}));

export const publicGalleryHighlights = [
  {
    title: "Executive arrivals",
    description:
      "Airport handovers, city transfers, and premium meet-and-greet presentation for leadership travel.",
    collection: "Airport" as const,
  },
  {
    title: "Corporate movement",
    description:
      "Reliable project, partner, and account-use mobility across Lusaka, Kitwe, and Ndola.",
    collection: "Corporate" as const,
  },
  {
    title: "Ceremony and event days",
    description:
      "Vehicles prepared for weddings, launches, conferences, and coordinated guest movement.",
    collection: "Weddings" as const,
  },
] as const;

export const publicGalleryAssets: GalleryAsset[] = [
  {
    id: "gal-airport-eclass",
    title: "VIP arrivals in Lusaka",
    caption: "Airport arrival coverage built for executive handover, luggage support, and direct city routing.",
    image: airportTransfers.heroImage,
    collection: "Airport",
    city: "Lusaka",
    href: "/services/airport-transfers",
    ctaLabel: "See service",
    size: "wide",
  },
  {
    id: "gal-corporate-hilux",
    title: "Project mobility with presence",
    caption: "Toyota Hilux support for site visits, team movement, and mixed-road assignments.",
    image: hilux.gallery[0],
    collection: "Corporate",
    city: "Kitwe",
    href: `/fleet/${hilux.slug}`,
    ctaLabel: "View vehicle",
    size: "tall",
  },
  {
    id: "gal-fleet-corolla-cross",
    title: "Premium SUV fleet detail",
    caption: "Toyota Corolla Cross positioned for airport runs and polished family travel.",
    image: corollaCross.gallery[1],
    collection: "Fleet",
    city: "Lusaka",
    href: `/fleet/${corollaCross.slug}`,
    ctaLabel: "View vehicle",
    size: "standard",
  },
  {
    id: "gal-wedding-bmw",
    title: "Ceremony-ready executive sedan",
    caption: "BMW 3 Series styling for intimate weddings, VIP hosting, and formal arrivals.",
    image: bmw.gallery[0],
    collection: "Weddings",
    city: "Lusaka",
    href: `/fleet/${bmw.slug}`,
    ctaLabel: "View vehicle",
    size: "standard",
  },
  {
    id: "gal-events-quantum",
    title: "Guest transport at scale",
    caption: "Toyota Quantum planning for conference shuttles, delegates, and event circulation.",
    image: quantum.gallery[0],
    collection: "Events",
    city: "Ndola",
    href: `/fleet/${quantum.slug}`,
    ctaLabel: "View vehicle",
    size: "wide",
  },
  {
    id: "gal-airport-service",
    title: "Arrival coordination",
    caption: "Meet-and-greet journeys built for delayed flights, luggage handling, and direct routing.",
    image: airportTransfers.heroImage,
    collection: "Airport",
    city: "Lusaka",
    href: "/services/airport-transfers",
    ctaLabel: "See service",
    size: "standard",
  },
  {
    id: "gal-corporate-service",
    title: "Corporate fleet planning",
    caption: "Account mobility for executives, site teams, and recurring business travel.",
    image: corporateHire.heroImage,
    collection: "Corporate",
    city: "Kitwe",
    href: "/services/corporate",
    ctaLabel: "See service",
    size: "standard",
  },
  {
    id: "gal-wedding-service",
    title: "Wedding day presentation",
    caption: "Luxury vehicle preparation designed for photo moments, ceremony timing, and standby service.",
    image: weddingCars.heroImage,
    collection: "Weddings",
    city: "Lusaka",
    href: "/services/weddings",
    ctaLabel: "See service",
    size: "tall",
  },
  {
    id: "gal-events-service",
    title: "Conference route management",
    caption: "Event mobility built for speakers, sponsors, teams, and venue-to-venue timing.",
    image: eventHire.heroImage,
    collection: "Events",
    city: "Ndola",
    href: "/services/events",
    ctaLabel: "See service",
    size: "standard",
  },
  {
    id: "gal-fleet-prado",
    title: "Commanding SUV profile",
    caption: "Toyota Prado coverage for premium road presence and longer intercity assignments.",
    image: prado.gallery[0],
    collection: "Fleet",
    city: "Lusaka",
    href: `/fleet/${prado.slug}`,
    ctaLabel: "View vehicle",
    size: "wide",
  },
  {
    id: "gal-self-drive-quest",
    title: "Self-drive city movement",
    caption: "Toyota Corolla Quest with straightforward daily pricing and efficient handover.",
    image: corollaQuest.gallery[0],
    collection: "Fleet",
    city: "Ndola",
    href: `/fleet/${corollaQuest.slug}`,
    ctaLabel: "View vehicle",
    size: "standard",
  },
  {
    id: "gal-self-drive-service",
    title: "Independent travel, cleaner booking",
    caption: "Digital self-drive planning with optional protection and fast vehicle matching.",
    image: selfDrive.heroImage,
    collection: "Fleet",
    city: "Kitwe",
    href: "/services/self-drive",
    ctaLabel: "See service",
    size: "standard",
  },
  {
    id: "gal-long-term-service",
    title: "Long-term fleet continuity",
    caption: "Monthly mobility planning for project teams, business units, and repeat-use operations.",
    image: longTerm.heroImage,
    collection: "Corporate",
    city: "Kitwe",
    href: "/services/long-term",
    ctaLabel: "See service",
    size: "standard",
  },
] as const;

export const gallerySpotlightVehicleSlugs = [
  corollaCross.slug,
  eClass.slug,
  quantum.slug,
] as const;

