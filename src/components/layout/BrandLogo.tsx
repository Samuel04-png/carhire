import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  href?: string;
  variant?: "transparent" | "boxed";
};

const logoSources = {
  transparent: "/brand/shark-logo-transparent.png",
  boxed: "/brand/shark-logo-on-white.png",
};

export function BrandLogo({
  className,
  imageClassName,
  priority = false,
  href = "/",
  variant = "transparent",
}: BrandLogoProps) {
  const image = (
    <img
      src={logoSources[variant]}
      alt="Shark Car Hire"
      className={cn("h-12 w-auto object-contain", imageClassName)}
      loading={priority ? "eager" : "lazy"}
    />
  );

  if (!href) {
    return <div className={className}>{image}</div>;
  }

  return (
    <Link to={href} className={className} aria-label="Shark Car Hire home">
      {image}
    </Link>
  );
}
