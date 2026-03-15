import { motion } from "motion/react";
import { Link } from "react-router-dom";

type Crumb = { label: string; href?: string };

type Props = {
  eyebrow?: string;
  title: string;
  description: string;
  image?: string;
  crumbs?: Crumb[];
  compact?: boolean;
};

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  crumbs = [],
  compact = false,
}: Props) {
  return (
    <section className="relative overflow-hidden bg-[var(--color-primary)] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(26,127,212,0.32),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(14,77,140,0.8),transparent_40%)]" />
      {image && (
        <div className="absolute inset-0 opacity-20">
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,22,40,0.35),rgba(10,22,40,0.92))]" />

      <div
        className={`relative mx-auto max-w-7xl px-4 ${
          compact ? "pb-12 pt-28" : "pb-16 pt-32 md:pb-20 md:pt-36"
        }`}
      >
        {crumbs.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-white/70">
            {crumbs.map((crumb, index) => (
              <span key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                {crumb.href ? (
                  <Link to={crumb.href} className="transition hover:text-white">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white">{crumb.label}</span>
                )}
                {index < crumbs.length - 1 && <span>/</span>}
              </span>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          {eyebrow && (
            <div className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/80 backdrop-blur">
              {eyebrow}
            </div>
          )}
          <h1 className="font-display text-5xl font-extrabold tracking-[-0.05em] md:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/78 md:text-xl">
            {description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
