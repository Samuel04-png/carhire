import { Link } from "react-router-dom";
import { cn, withBase } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  href?: string;
  variant?: "transparent" | "boxed";
};

const logoSources = {
  transparent: withBase("/brand/dots/dots-logo-navbar.png"),
  boxed: withBase("/brand/dots/dots-logo-navbar.png"),
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
      alt="Dots Car Hire"
      className={cn("block h-12 w-auto object-contain", imageClassName)}
      loading={priority ? "eager" : "lazy"}
    />
  );

  if (!href) {
    return <div className={className}>{image}</div>;
  }

  return (
    <Link to={href} className={className} aria-label="Dots Car Hire home">
      {image}
    </Link>
  );
}
