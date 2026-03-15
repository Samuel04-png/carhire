import type { Service } from "@/types";

export const services: Service[] = [
  {
    slug: "airport-transfers",
    title: "Airport Transfers",
    shortTitle: "Airport Transfers",
    tagline:
      "Meet-and-greet transfers with polished drivers, live arrival coordination, and premium vehicles.",
    description:
      "Fast, reliable pickups for business arrivals, VIP guests, and family travel with proactive flight monitoring and a professional handover experience.",
    heroImage:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
    icon: "Plane",
    accentLabel: "Real-time monitored",
    primaryCta: "Book Airport Transfer",
    ctaHref: "/book/step-1",
    includes: [
      "Flight tracking and delay monitoring",
      "Meet-and-greet at arrivals",
      "Luggage assistance",
      "Chauffeur-first service standards",
    ],
    process: [
      "Share your arrival or departure details.",
      "We assign the right vehicle and driver by city.",
      "Your driver tracks timing changes and contacts you before pickup.",
      "You ride with live support available if plans change.",
    ],
    pricingNote:
      "Starting from K950 depending on city, timing, and vehicle class.",
    testimonialIds: ["t1", "t4"],
    vehicleCategories: ["Economy", "Saloon", "SUV", "Luxury"],
    faq: [
      {
        question: "Do you track delayed flights?",
        answer:
          "Yes. Airport transfer jobs are monitored in real time so the driver adjusts arrival timing without you needing to rebook.",
      },
      {
        question: "Can I request a name board?",
        answer:
          "Yes. Name board meet-and-greet is available and is included in premium airport packages.",
      },
      {
        question: "Which airports do you cover?",
        answer:
          "We cover Lusaka, Ndola, and Kitwe transfer corridors and arrange longer-distance pickups on request.",
      },
      {
        question: "Do you offer late-night airport pickups?",
        answer:
          "Yes. Night pickups are available with prior confirmation so your driver is scheduled correctly.",
      },
    ],
  },
  {
    slug: "corporate",
    title: "Corporate Hire",
    shortTitle: "Corporate Hire",
    tagline:
      "Dedicated business mobility for teams, executives, visiting partners, and project operations.",
    description:
      "Structured business accounts with monthly invoicing, account support, and dependable fleet allocation across Shark Car Hire's operating cities.",
    heroImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    icon: "BriefcaseBusiness",
    accentLabel: "Business-ready",
    primaryCta: "Open Corporate Account",
    ctaHref: "/contact",
    includes: [
      "Monthly invoicing and statements",
      "Priority reservations",
      "Dedicated account support",
      "Driver and executive vehicle scheduling",
    ],
    process: [
      "Share your account setup requirements.",
      "We configure rates, invoicing preferences, and contacts.",
      "Your team books through a fast corporate workflow.",
      "You receive usage visibility and billing control each month.",
    ],
    pricingNote:
      "Corporate pricing is customised by usage profile, fleet mix, and contract term.",
    testimonialIds: ["t2", "t6"],
    vehicleCategories: ["Saloon", "SUV", "Luxury", "Pickup"],
    faq: [
      {
        question: "Can we book multiple vehicles under one account?",
        answer:
          "Yes. Corporate accounts support multiple authorised users and consolidated monthly billing.",
      },
      {
        question: "Do you support site and project mobility?",
        answer:
          "Yes. We provide operational fleet planning for field teams, project leads, and visiting executives.",
      },
      {
        question: "How fast can an account go live?",
        answer:
          "Most accounts can be configured within one business day once approval details are shared.",
      },
      {
        question: "Can we have both self-drive and chauffeur bookings?",
        answer:
          "Yes. Corporate accounts can mix both service modes depending on the role and journey.",
      },
    ],
  },
  {
    slug: "weddings",
    title: "Wedding Cars",
    shortTitle: "Wedding Cars",
    tagline:
      "Elegant arrival vehicles, polished chauffeurs, and picture-ready presentation for your event day.",
    description:
      "Luxury sedans and SUVs prepared for ceremonies, VIP guest movements, and full day wedding logistics with premium detailing.",
    heroImage:
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1600&q=80",
    icon: "Gem",
    accentLabel: "Ceremony ready",
    primaryCta: "Check Wedding Availability",
    ctaHref: "/contact",
    includes: [
      "Decor-ready luxury fleet",
      "Uniformed chauffeurs",
      "Multi-stop itinerary planning",
      "Photo-friendly handover timing",
    ],
    process: [
      "Choose your preferred hero car or wedding convoy mix.",
      "Share venue schedule and route timing.",
      "We confirm decoration windows and driver coordination.",
      "Your vehicles arrive detailed and stage-ready.",
    ],
    pricingNote:
      "Packages are quoted based on hours, distance, and vehicle combination.",
    testimonialIds: ["t3", "t5"],
    vehicleCategories: ["Luxury", "SUV", "Saloon"],
    faq: [
      {
        question: "Can we book more than one car?",
        answer:
          "Yes. We support bridal cars, groom transfers, family vehicles, and full convoy coordination.",
      },
      {
        question: "Do you allow external floral decorators?",
        answer:
          "Yes, provided timing is confirmed with us to protect paintwork and handover schedules.",
      },
      {
        question: "Can the chauffeur stay on standby?",
        answer:
          "Yes. Standby service is available for full event coverage or specific windows.",
      },
      {
        question: "How early should I book?",
        answer:
          "Peak weekends move quickly, so we recommend securing premium cars several weeks in advance.",
      },
    ],
  },
  {
    slug: "events",
    title: "Event Hire",
    shortTitle: "Event Hire",
    tagline:
      "Vehicle coordination for conferences, launches, delegations, and special events.",
    description:
      "A structured event mobility service for moving speakers, executives, and guests on tight schedules across multiple venues.",
    heroImage:
      "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1600&q=80",
    icon: "CalendarDays",
    accentLabel: "Multi-vehicle logistics",
    primaryCta: "Request Event Quote",
    ctaHref: "/contact",
    includes: [
      "Multi-vehicle planning",
      "Dispatch coordination",
      "VIP guest handling",
      "Event-day mobility support",
    ],
    process: [
      "Share the event schedule and guest profile.",
      "We design a vehicle and driver plan by route and timing.",
      "Dispatch is coordinated in advance with contingency coverage.",
      "Your guests and teams move on a clear transport plan.",
    ],
    pricingNote:
      "Event pricing depends on vehicle count, hours, and route complexity.",
    testimonialIds: ["t2", "t4"],
    vehicleCategories: ["Saloon", "SUV", "Minibus", "Luxury"],
    faq: [
      {
        question: "Can you move guests across multiple venues?",
        answer:
          "Yes. Event hire supports venue hopping, speaker movements, and guest group transport.",
      },
      {
        question: "Do you provide minibuses?",
        answer:
          "Yes. Minibus options are available for coordinated staff or guest movement.",
      },
      {
        question: "Can you manage VIP arrivals?",
        answer:
          "Yes. VIP sequences can be isolated with premium vehicles and dedicated chauffeurs.",
      },
      {
        question: "Do you offer same-day event support?",
        answer: "Yes, subject to fleet availability and route feasibility.",
      },
    ],
  },
  {
    slug: "self-drive",
    title: "Self-Drive",
    shortTitle: "Self-Drive",
    tagline:
      "Fast digital booking for travellers and teams that want independent movement with a premium fleet.",
    description:
      "Browse reliable vehicles, compare features, and reserve the right category with clear requirements and responsive support.",
    heroImage:
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=80",
    icon: "KeyRound",
    accentLabel: "Fast checkout",
    primaryCta: "Browse Self-Drive Fleet",
    ctaHref: "/fleet?driverMode=Self-Drive",
    includes: [
      "Transparent documentation requirements",
      "Flexible vehicle categories",
      "Optional insurance upgrades",
      "Live fleet browsing and filtering",
    ],
    process: [
      "Choose your dates, city, and vehicle type.",
      "Review requirements and optional protection add-ons.",
      "Submit your details and confirm payment.",
      "Collect the vehicle or arrange delivery where available.",
    ],
    pricingNote:
      "Daily, weekly, and monthly rates vary by vehicle class and city.",
    testimonialIds: ["t1", "t6"],
    vehicleCategories: ["Economy", "Saloon", "SUV", "Pickup", "Minibus"],
    faq: [
      {
        question: "What documents do I need?",
        answer:
          "A valid ID or passport, driving licence, and booking contact details are required for self-drive rentals.",
      },
      {
        question: "Can I add an extra driver?",
        answer: "Yes. Additional driver cover can be added during booking.",
      },
      {
        question: "Are all vehicles available for self-drive?",
        answer:
          "No. Some premium or specialist vehicles are chauffeur-only depending on operational rules.",
      },
      {
        question: "Can I book for another city return?",
        answer:
          "Cross-city returns can be arranged on request and may involve a repositioning charge.",
      },
    ],
  },
  {
    slug: "long-term",
    title: "Long Term Lease",
    shortTitle: "Long Term",
    tagline:
      "Long-duration vehicle support for projects, executive use, and growing business operations.",
    description:
      "Lease-ready fleet plans for organisations that need dependable mobility over weeks or months with operational oversight.",
    heroImage:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1600&q=80",
    icon: "Shield",
    accentLabel: "Project mobility",
    primaryCta: "Get Lease Quote",
    ctaHref: "/contact",
    includes: [
      "Monthly rates and contract support",
      "Fleet rotation planning",
      "Maintenance coordination",
      "Corporate and project reporting",
    ],
    process: [
      "Share fleet requirements and operating cities.",
      "We propose lease terms and category mix.",
      "Vehicles are assigned with support rules and contacts.",
      "You receive ongoing fleet visibility and service coverage.",
    ],
    pricingNote:
      "Long-term rates are quoted by duration, usage profile, and service mode.",
    testimonialIds: ["t2", "t5"],
    vehicleCategories: ["Economy", "Saloon", "SUV", "Pickup", "Minibus"],
    faq: [
      {
        question: "Do you support monthly invoicing?",
        answer:
          "Yes. Lease and corporate contracts can be billed monthly with agreed account controls.",
      },
      {
        question: "Can we mix categories in one contract?",
        answer:
          "Yes. Contracts can include operational pickups, executive sedans, SUVs, and minibuses.",
      },
      {
        question: "How is maintenance handled?",
        answer:
          "We plan maintenance windows and swap vehicles where contract terms require continuity.",
      },
      {
        question: "Can long-term vehicles move between cities?",
        answer:
          "Yes, provided routing and operational approval are aligned to the contract scope.",
      },
    ],
  },
];
