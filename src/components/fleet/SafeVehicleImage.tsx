import { useState } from "react";
import { withBase } from "@/lib/utils";

export const vehicleImageFallback = withBase("/brand/dots/fleet/placeholder/vehicle-placeholder.svg");

type SafeVehicleImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
  referrerPolicy?: "no-referrer" | "origin" | "unsafe-url";
};

function logVehicleImageIssue(src: string | null | undefined, alt: string) {
  if (!src || src === vehicleImageFallback) return;

  const issue = {
    src,
    alt,
    page: typeof window !== "undefined" ? window.location.pathname : "unknown",
    timestamp: new Date().toISOString(),
  };

  // Static GitHub Pages cannot persist server logs, so keep a local admin-visible trail.
  try {
    const key = "dotsVehicleImageIssues";
    const existing = JSON.parse(window.localStorage.getItem(key) || "[]");
    window.localStorage.setItem(key, JSON.stringify([issue, ...existing].slice(0, 50)));
  } catch {
    // Ignore storage errors; the visual fallback still protects the UI.
  }

  if (import.meta.env.DEV) {
    console.warn("Vehicle image failed to load", issue);
  }
}

export function SafeVehicleImage({
  src,
  alt,
  className,
  loading = "lazy",
  referrerPolicy = "no-referrer",
}: SafeVehicleImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src || vehicleImageFallback);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading={loading}
      referrerPolicy={referrerPolicy}
      onError={() => {
        logVehicleImageIssue(currentSrc, alt);
        if (currentSrc !== vehicleImageFallback) {
          setCurrentSrc(vehicleImageFallback);
        }
      }}
    />
  );
}
