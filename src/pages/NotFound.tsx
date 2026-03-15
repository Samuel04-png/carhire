import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[var(--color-gray-100)] px-4 pt-28">
      <div className="max-w-xl rounded-[34px] border border-[var(--color-gray-200)] bg-white p-10 text-center shadow-[0_20px_70px_rgba(10,22,40,0.08)]">
        <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
          404
        </div>
        <h1 className="mt-4 font-display text-5xl font-bold tracking-[-0.05em] text-[var(--color-primary)]">
          Page not found
        </h1>
        <p className="mt-4 text-[var(--color-gray-600)]">
          This page is not where you were heading. Let us point you back to the
          right place.
        </p>
        <div className="mt-8 flex justify-center">
          <Button asChild className="rounded-full">
            <Link to="/">Back to homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

