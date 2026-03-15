import type { BlogPost, City, LocationOffice, Testimonial } from "@/types";

export const company = {
  name: "Shark Car Hire",
  tagline: "Premium vehicles. Professional service. Kitwe, Lusaka, Ndola.",
  phone: "+260 970 000 000",
  phoneAlt: "+260 960 111 222",
  email: "bookings@sharkcarhire.com",
  whatsapp: "https://wa.me/260970000000",
  address: "Great East Road, Lusaka, Zambia",
  founded: 2016,
};

export const cities: City[] = ["Lusaka", "Kitwe", "Ndola"];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Mutale Banda",
    role: "Operations Lead",
    company: "Copperbelt Energy Partners",
    quote:
      "The booking flow was fast, the vehicle arrived spotless, and the team handled a last-minute timing change without friction.",
    rating: 5,
  },
  {
    id: "t2",
    name: "Chileshe Phiri",
    role: "Admin Manager",
    company: "Northgate Mining Services",
    quote:
      "For executive airport pickups and site visits, Shark gives us the reliability and polish we need in front of partners.",
    rating: 5,
  },
  {
    id: "t3",
    name: "Natasha Mwila",
    role: "Bride",
    company: "Private Client",
    quote:
      "The chauffeur, the presentation, and the timing on the day were exact. The cars looked expensive and photographed beautifully.",
    rating: 5,
  },
  {
    id: "t4",
    name: "Alick Musonda",
    role: "Travel Coordinator",
    company: "Lusaka Growth Forum",
    quote:
      "We moved delegates across sessions all day with zero drama. The dispatch team was responsive and organised.",
    rating: 5,
  },
  {
    id: "t5",
    name: "Racheal Tembo",
    role: "Project Director",
    company: "Blue River Infrastructure",
    quote:
      "Their long-term fleet support gave us better visibility, cleaner reporting, and fewer transport issues on our project sites.",
    rating: 5,
  },
  {
    id: "t6",
    name: "Brian Kunda",
    role: "Procurement Lead",
    company: "Savanna Foods Zambia",
    quote:
      "Corporate account setup was straightforward, and the digital dashboard makes it much easier to manage recurring bookings.",
    rating: 5,
  },
];

export const offices: LocationOffice[] = [
  {
    city: "Lusaka",
    label: "Lusaka HQ",
    address: "Great East Road, Rhodes Park, Lusaka, Zambia",
    phone: "+260 970 000 000",
    hours: "Mon-Sun, 06:00 to 22:00",
    mapEmbed: "https://www.google.com/maps?q=Lusaka%20Zambia&output=embed",
    directionsUrl: "https://maps.google.com/?q=Lusaka%20Zambia",
    summary:
      "Primary operations hub covering airport pickups, executive city transfers, and corporate account support.",
  },
  {
    city: "Kitwe",
    label: "Kitwe Operations",
    address: "Freedom Avenue, Parklands, Kitwe, Zambia",
    phone: "+260 960 111 222",
    hours: "Mon-Sun, 06:00 to 21:00",
    mapEmbed: "https://www.google.com/maps?q=Kitwe%20Zambia&output=embed",
    directionsUrl: "https://maps.google.com/?q=Kitwe%20Zambia",
    summary:
      "Copperbelt coverage for airport transfers, field mobility, and mining-sector corporate bookings.",
  },
  {
    city: "Ndola",
    label: "Ndola Service Point",
    address: "Broadway, Kansenshi, Ndola, Zambia",
    phone: "+260 961 444 555",
    hours: "Mon-Sun, 07:00 to 21:00",
    mapEmbed: "https://www.google.com/maps?q=Ndola%20Zambia&output=embed",
    directionsUrl: "https://maps.google.com/?q=Ndola%20Zambia",
    summary:
      "Efficient pickup, return, and chauffeur support for business travel and regional event movements.",
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
      "Shark Car Hire serves Lusaka, Kitwe, and Ndola with tailored corporate, airport, event, and self-drive coverage.",
  },
];
