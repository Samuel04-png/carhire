import type { ReactNode } from "react";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { company } from "@/data/mock";
import { useAppStore } from "@/store/use-app-store";

export default function AccountAuthPage() {
  const navigate = useNavigate();
  const clients = useAppStore((state) => state.clients);
  const setCustomerSession = useAppStore((state) => state.setCustomerSession);
  const [tab, setTab] = useState<"sign-in" | "register">("sign-in");

  const handleSignIn = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").toLowerCase();
    const match = clients.find((client) => client.email.toLowerCase() === email);
    if (!match) {
      toast.error("We could not find an account with that email.");
      return;
    }
    setCustomerSession(match.id);
    toast.success("Signed in to the customer portal.");
    navigate("/account/dashboard");
  };

  const handleRegister = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCustomerSession(clients[0]?.id ?? null);
    toast.success("Account created. You can now view your bookings.");
    navigate("/account/dashboard");
  };

  return (
    <div className="bg-[var(--color-gray-100)] px-4 pb-20 pt-28">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[36px] bg-[var(--color-primary)] p-8 text-white shadow-[0_20px_80px_rgba(10,22,40,0.18)]">
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
            Customer account
          </div>
          <h1 className="mt-4 font-display text-5xl font-bold tracking-[-0.06em]">
            Return to your bookings, profile, and loyalty view.
          </h1>
          <p className="mt-6 text-white/72">
            Sign in to review active bookings, past journeys, saved details, and
            account preferences in one place.
          </p>
          <div className="mt-10 rounded-[28px] bg-white/8 p-5">
            <div className="font-semibold">{company.name}</div>
            <div className="mt-2 text-sm text-white/70">{company.tagline}</div>
          </div>
        </div>

        <div className="rounded-[36px] border border-[var(--color-gray-200)] bg-white p-8 shadow-[0_20px_80px_rgba(10,22,40,0.08)]">
          <div className="mb-8 flex gap-3">
            {[
              ["sign-in", "Sign In"],
              ["register", "Create Account"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setTab(value as typeof tab)}
                className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                  tab === value
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-gray-100)] text-[var(--color-gray-600)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "sign-in" ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <Field label="Email">
                <input name="email" className={inputClassName} defaultValue="mutale.banda@example.com" />
              </Field>
              <Field label="Password">
                <input name="password" type="password" className={inputClassName} defaultValue="password123" />
              </Field>
              <Button type="submit" className="mt-4 h-14 rounded-full px-8">
                Sign In
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="grid gap-4 md:grid-cols-2">
              <Field label="Full name">
                <input className={inputClassName} defaultValue="New Client" />
              </Field>
              <Field label="Phone">
                <input className={inputClassName} defaultValue="+260 977 000 000" />
              </Field>
              <Field label="Email">
                <input className={inputClassName} type="email" defaultValue="new.client@example.com" />
              </Field>
              <Field label="Password">
                <input className={inputClassName} type="password" defaultValue="password123" />
              </Field>
              <div className="md:col-span-2">
                <Button type="submit" className="h-14 rounded-full px-8">
                  Create Account
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gray-500)]">
        {label}
      </div>
      {children}
    </label>
  );
}

const inputClassName =
  "h-14 w-full rounded-2xl border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-4 outline-none focus:border-[var(--color-accent)]";
