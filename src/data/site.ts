import type { BlogPost, City, LocationOffice, Testimonial } from "@/types";

export const company = {
  name: "Dots Car Hire",
  tagline: "Reliable car rental, always on time — Lusaka and Ndola.",
  phone: "+260 962 106 053",
  phoneAlt: "+260 965 796 430",
  email: "bookings@dotscarhire.com",
  whatsapp: "https://wa.me/260962106053",
  address: "House Number 11 Kamwala South, opposite Spectra Filling Station, Lusaka, Zambia",
  founded: 2024,
};

export const cities: City[] = ["Lusaka", "Ndola"];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Events Client",
    role: "Event Coordinator",
    company: "Lusaka Special Events",
    quote:
      "Dots handled guest movement with clean vehicles, timely coordination, and clear phone support throughout the event day.",
    rating: 5,
  },
  {
    id: "t2",
    name: "Corporate Traveller",
    role: "Business Client",
    company: "Private Client",
    quote:
      "The team was responsive on WhatsApp and helped us secure reliable transport quickly for Lusaka movement.",
    rating: 5,
  },
  {
    id: "t3",
    name: "Wedding Client",
    role: "Private Event Client",
    company: "Wedding Hire",
    quote:
      "The vehicle presentation was photo-ready and the chauffeur support made the day feel organised.",
    rating: 5,
  },
];

export const offices: LocationOffice[] = [
  {
    city: "Lusaka",
    label: "Lusaka Branch",
    address: "House Number 11 Kamwala South, opposite Spectra Filling Station, Lusaka, Zambia",
    phone: "+260 962 106 053",
    hours: "24/7 by confirmed booking",
    mapEmbed: "https://www.google.com/maps?q=Kamwala%20South%20Spectra%20Filling%20Station%20Lusaka%20Zambia&output=embed",
    directionsUrl: "https://maps.google.com/?q=Kamwala%20South%20Spectra%20Filling%20Station%20Lusaka%20Zambia",
    summary:
      "Main Dots Car Hire branch for self-drive, chauffeur, event, wedding, and airport movement across Lusaka.",
  },
  {
    city: "Ndola",
    label: "Ndola Branch",
    address: "Office 3, 32 Broadway, Ndola, Zambia",
    phone: "+260 965 796 430",
    hours: "24/7 by confirmed booking",
    mapEmbed: "https://www.google.com/maps?q=32%20Broadway%20Ndola%20Zambia&output=embed",
    directionsUrl: "https://maps.google.com/?q=32%20Broadway%20Ndola%20Zambia",
    summary:
      "Ndola branch support for Copperbelt bookings, business travel, and event vehicle hire.",
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-choose-a-corporate-fleet-partner-in-zambia",
    title: "How To Choose A Corporate Fleet Partner In Zambia",
    category: "Corporate Travel",
    excerpt:
      "What operations teams should check before committing to a transport partner for executives, projects, and visiting stakeholders.",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-03-02",
    readTime: "5 min read",
    content: [
      "A strong fleet partner should give you more than cars. You need clear account controls, dependable availability, clean reporting, and drivers who represent your business well.",
      "Look for business account structure, monthly invoicing, clear service boundaries per city, and a booking workflow that does not force your admin team through consumer-grade friction each time.",
      "Operational visibility matters. If your supplier cannot show booking status, active vehicles, and payment state quickly, they will become harder to manage as usage grows.",
    ],
  },
  {
    slug: "airport-transfer-checklist-for-vip-arrivals",
    title: "Airport Transfer Checklist For VIP Arrivals",
    category: "Airport Transfers",
    excerpt:
      "The practical details that make executive and VIP arrivals feel calm instead of improvised.",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-02-22",
    readTime: "4 min read",
    content: [
      "Arrival handling starts before the flight lands. Vehicle readiness, driver briefing, route checks, and contact handoff should be confirmed in advance.",
      "Meet-and-greet service should include luggage support, name-board preparation, and a fallback contact route if the traveller's device is offline.",
      "For VIP movements, the difference is in the discipline: clean vehicle presentation, exact timing, and a calm escalation path if plans move.",
    ],
  },
  {
    slug: "why-maintenance-visibility-matters-for-car-hire-clients",
    title: "Why Maintenance Visibility Matters For Car Hire Clients",
    category: "Fleet Operations",
    excerpt:
      "Premium presentation is not enough. Clients also need confidence that the fleet is maintained and deployment-ready.",
    image:
      "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-02-12",
    readTime: "6 min read",
    content: [
      "When a vehicle looks premium but the back-office maintenance process is weak, operations suffer fast. Service windows, document expiry, and route suitability need active oversight.",
      "Clients notice the results indirectly through fewer breakdowns, better punctuality, and a smoother booking-to-handover experience.",
      "A serious car hire operation tracks fleet availability and maintenance in the same operational system, not as separate disconnected tasks.",
    ],
  },
  {
    slug: "wedding-car-planning-timeline",
    title: "Wedding Car Planning Timeline",
    category: "Wedding Cars",
    excerpt:
      "A simple planning sequence for securing the right bridal car, convoy support, and event-day timing.",
    image:
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-01-28",
    readTime: "4 min read",
    content: [
      "Start with the visual role of each car: hero arrival, family support, guest transfer, or venue shuttle. That determines category and driver requirements.",
      "Confirm venue timing, decoration access, standby windows, and whether the car needs to stay photo-ready across multiple stops.",
      "Premium wedding transport is less about the badge alone and more about timing precision, finish quality, and calm coordination on the day.",
    ],
  },
];

export const faqs = [
  {
    category: "Booking",
    question: "How quickly is a booking confirmed?",
    answer:
      "Online bookings are saved instantly and then confirmed based on vehicle availability and payment method. Paid bookings are prioritised for rapid confirmation.",
  },
  {
    category: "Booking",
    question: "Can I change a booking after confirmation?",
    answer:
      "Yes. Booking changes depend on vehicle availability, timing, and any rate difference. Admin can also modify reservations from the operations dashboard.",
  },
  {
    category: "Payments",
    question: "Which payment options do you support?",
    answer:
      "MTN Mobile Money, Airtel Money, bank transfer, and card payments are available. Verified corporate accounts can also be billed on approved terms.",
  },
  {
    category: "Requirements",
    question: "Do self-drive bookings require a licence upload?",
    answer:
      "Yes. Self-drive reservations require valid identity and driving licence details. Chauffeur bookings do not require customer licence capture.",
  },
  {
    category: "Support",
    question: "Is WhatsApp support available?",
    answer:
      "Yes. WhatsApp support is available for booking questions, updates, and payment follow-up during business hours.",
  },
  {
    category: "Coverage",
    question: "Which cities do you operate in?",
    answer:
      "Dots Car Hire serves Lusaka and Ndola with reliable self-drive, chauffeur, airport, event, and special-occasion coverage.",
  },
];
