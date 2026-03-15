import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Image,
  MapPin,
  Sparkles,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { VehicleCard } from "@/components/fleet/VehicleCard";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { vehicles } from "@/data/mock";
import {
  gallerySpotlightVehicleSlugs,
  publicGalleryAssets,
  publicGalleryHighlights,
  type GalleryAsset,
  type PublicGalleryCollection,
} from "@/data/showcase";

const filters: Array<"All" | PublicGalleryCollection> = [
  "All",
  "Fleet",
  "Airport",
  "Corporate",
  "Weddings",
  "Events",
];

const sizeClassName: Record<GalleryAsset["size"], string> = {
  standard: "min-h-[260px] md:row-span-2",
  tall: "min-h-[340px] md:row-span-3",
  wide: "min-h-[280px] md:col-span-2 md:row-span-2",
};

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState<"All" | PublicGalleryCollection>("All");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const filteredAssets = useMemo(
    () =>
      activeFilter === "All"
        ? publicGalleryAssets
        : publicGalleryAssets.filter((asset) => asset.collection === activeFilter),
    [activeFilter],
  );

  const spotlightVehicles = useMemo(
    () =>
      gallerySpotlightVehicleSlugs
        .map((slug) => vehicles.find((vehicle) => vehicle.slug === slug))
        .filter((vehicle) => vehicle !== undefined),
    [],
  );

  const activeAsset = activeIndex !== null ? filteredAssets[activeIndex] : null;

  useEffect(() => {
    if (!activeAsset) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((current) => {
          if (current === null) return current;
          return (current + 1) % filteredAssets.length;
        });
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((current) => {
          if (current === null) return current;
          return (current - 1 + filteredAssets.length) % filteredAssets.length;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeAsset, filteredAssets.length]);

  useEffect(() => {
    setActiveIndex(null);
  }, [activeFilter]);

  const openAsset = (asset: GalleryAsset) => {
    const index = filteredAssets.findIndex((item) => item.id === asset.id);
    setActiveIndex(index >= 0 ? index : 0);
  };

  const goPrevious = () => {
    setActiveIndex((current) => {
      if (current === null) return current;
      return (current - 1 + filteredAssets.length) % filteredAssets.length;
    });
  };

  const goNext = () => {
    setActiveIndex((current) => {
      if (current === null) return current;
      return (current + 1) % filteredAssets.length;
    });
  };

  return (
    <div className="bg-[var(--color-gray-100)] pb-20">
      <PageHero
        eyebrow="Gallery"
        title="The public image library for fleet, events, airport, and corporate movement."
        description="Browse how Shark positions its vehicles across executive arrivals, wedding presentation, event logistics, and day-to-day business travel."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Gallery" },
        ]}
        image={publicGalleryAssets[0].image}
      />

      <section className="mx-auto max-w-7xl px-4 pt-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {publicGalleryHighlights.map((highlight) => (
            <button
              key={highlight.title}
              type="button"
              onClick={() => setActiveFilter(highlight.collection)}
              className="rounded-[32px] border border-[var(--color-gray-200)] bg-white p-6 text-left shadow-[0_18px_70px_rgba(10,22,40,0.06)] transition hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(10,22,40,0.1)]"
            >
              <div className="inline-flex rounded-full border border-[var(--color-accent)]/18 bg-[var(--color-accent)]/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
                {highlight.collection}
              </div>
              <div className="mt-5 font-display text-3xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">
                {highlight.title}
              </div>
              <p className="mt-3 text-sm leading-7 text-[var(--color-gray-600)]">
                {highlight.description}
              </p>
              <div className="mt-6 inline-flex items-center text-sm font-semibold text-[var(--color-accent)]">
                Open collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="rounded-[34px] border border-[var(--color-gray-200)] bg-white p-6 shadow-[0_20px_80px_rgba(10,22,40,0.08)] sm:p-8">
          <SectionHeader
            eyebrow="Media wall"
            title="Curated public imagery with direct links back into the live product."
            description="Use the filters to isolate airport, corporate, wedding, event, or fleet content. Each frame stays connected to the vehicle or service it represents."
          />

          <div className="mt-8 flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                  activeFilter === filter
                    ? "bg-[var(--color-primary)] text-white shadow-[0_16px_40px_rgba(10,22,40,0.18)]"
                    : "border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] text-[var(--color-gray-600)] hover:border-[var(--color-gray-300)]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-[var(--color-gray-500)]">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-4 py-2">
              <Image className="h-4 w-4 text-[var(--color-accent)]" />
              {filteredAssets.length} assets visible
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-4 py-2">
              <Sparkles className="h-4 w-4 text-[var(--color-accent)]" />
              Every image links to a live page
            </div>
          </div>

          <div className="mt-8 grid auto-rows-[120px] gap-4 md:grid-cols-2 md:auto-rows-[110px] xl:grid-cols-3">
            {filteredAssets.map((asset) => (
              <button
                key={asset.id}
                type="button"
                onClick={() => openAsset(asset)}
                className={`group relative overflow-hidden rounded-[28px] text-left shadow-[0_18px_70px_rgba(10,22,40,0.1)] ${sizeClassName[asset.size]}`}
              >
                <img
                  src={asset.image}
                  alt={asset.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,22,40,0.08),rgba(10,22,40,0.88))]" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-white/15 bg-white/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/82 backdrop-blur">
                      {asset.collection}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/82 backdrop-blur">
                      <MapPin className="h-3 w-3" />
                      {asset.city}
                    </span>
                  </div>
                  <div className="font-display text-2xl font-bold tracking-[-0.04em] text-white">
                    {asset.title}
                  </div>
                  <p className="mt-2 max-w-lg text-sm leading-7 text-white/74">{asset.caption}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4">
        <div className="rounded-[36px] bg-[linear-gradient(150deg,#081222_0%,#0e1f3a_58%,#12345d_100%)] p-6 text-white shadow-[0_24px_100px_rgba(10,22,40,0.18)] sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/76">
                Vehicle spotlight
              </div>
              <h2 className="mt-5 font-display text-4xl font-bold tracking-[-0.05em] sm:text-5xl">
                Book the vehicles that carry the strongest public image.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/72">
                These are the vehicles clients most often use for airport handovers, executive movement, and guest-facing presentation.
              </p>
            </div>
            <Button asChild variant="ghost" className="rounded-full px-8">
              <Link to="/book/step-1">Start Booking</Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-6 xl:grid-cols-3">
            {spotlightVehicles.map((vehicle) => (
              <div key={vehicle.id} className="rounded-[30px] bg-white/6 p-2 backdrop-blur">
                <VehicleCard vehicle={vehicle} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeAsset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-[rgba(4,10,20,0.88)] backdrop-blur-sm"
            onClick={() => setActiveIndex(null)}
          >
            <div className="mx-auto flex h-full max-w-7xl flex-col px-4 py-4 sm:py-6">
              <div className="mb-4 flex items-center justify-between gap-4 text-white">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
                    {activeAsset.collection}
                  </div>
                  <div className="mt-1 font-display text-2xl font-bold tracking-[-0.04em]">
                    {activeAsset.title}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveIndex(null)}
                  className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/8 text-white"
                  aria-label="Close gallery image"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <motion.div
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 24, opacity: 0 }}
                transition={{ duration: 0.24 }}
                className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_340px]"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="relative min-h-[280px] overflow-hidden rounded-[32px] border border-white/10 bg-black/40">
                  <img
                    src={activeAsset.image}
                    alt={activeAsset.title}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    type="button"
                    onClick={goPrevious}
                    className="absolute left-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/12 bg-[rgba(10,22,40,0.55)] text-white backdrop-blur"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute right-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/12 bg-[rgba(10,22,40,0.55)] text-white backdrop-blur"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                <div className="overflow-y-auto rounded-[32px] border border-white/10 bg-[rgba(10,22,40,0.55)] p-6 text-white backdrop-blur">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/75">
                    <MapPin className="h-3 w-3" />
                    {activeAsset.city}
                  </div>
                  <p className="mt-5 text-base leading-8 text-white/76">{activeAsset.caption}</p>
                  <div className="mt-6 rounded-[24px] border border-white/10 bg-white/6 p-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">
                      Asset {activeIndex + 1} of {filteredAssets.length}
                    </div>
                    <div className="mt-3 text-sm leading-7 text-white/72">
                      This frame stays tied to a live page so prospects can move straight from image impression to booking or service detail.
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col gap-3">
                    <Button asChild className="rounded-full">
                      <Link to={activeAsset.href}>{activeAsset.ctaLabel}</Link>
                    </Button>
                    <Button asChild variant="ghost" className="rounded-full">
                      <Link to="/contact">Request this setup</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
