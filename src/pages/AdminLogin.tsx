import type { FormEvent, ReactNode } from "react";
import { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { adminAccessProfiles, demoAdminPassword } from "@/data/admin";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/use-app-store";
import type { AdminRole } from "@/types";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const adminRole = useAppStore((state) => state.adminRole);
  const setAdminRole = useAppStore((state) => state.setAdminRole);

  const defaultProfile = adminAccessProfiles[0];
  const [role, setRole] = useState<AdminRole>(defaultProfile.role);
  const [email, setEmail] = useState(defaultProfile.email);
  const [password, setPassword] = useState(demoAdminPassword);

  const selectedProfile = useMemo(
    () => adminAccessProfiles.find((profile) => profile.role === role) ?? defaultProfile,
    [role],
  );

  if (adminRole) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const matchesProfile =
      email.trim().toLowerCase() === selectedProfile.email.toLowerCase() &&
      password.trim() === demoAdminPassword;

    if (!matchesProfile) {
      toast.error("Use the demo credentials shown for the selected admin role.");
      return;
    }

    setAdminRole(role);
    toast.success(`Signed in as ${role}.`);
    navigate("/admin/dashboard");
  };

  const applyProfile = (nextRole: AdminRole) => {
    const profile = adminAccessProfiles.find((item) => item.role === nextRole);
    if (!profile) return;
    setRole(profile.role);
    setEmail(profile.email);
    setPassword(demoAdminPassword);
  };

  return (
    <div className="min-h-screen bg-[var(--color-primary)] px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-6 text-white shadow-lg sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-md border border-white/12 bg-white/[0.06] px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-white/72">
            <ShieldCheck className="h-4 w-4" />
            Admin access
          </div>
          <h1 className="mt-5 max-w-xl font-display text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
            Run bookings, fleet, dispatch, and revenue from one operations console.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/72 sm:text-base">
            This access screen mirrors operational roles for sales, dispatch, and finance.
            Choose a role, confirm its email, and enter the assigned admin password.
          </p>

          <div className="mt-7 grid gap-3">
            {adminAccessProfiles.map((profile) => {
              const active = profile.role === role;
              return (
                <button
                  key={profile.role}
                  type="button"
                  onClick={() => applyProfile(profile.role)}
                  className={`rounded-lg border px-4 py-4 text-left transition-colors ${
                    active
                      ? "border-[var(--color-accent)] bg-white/[0.08]"
                      : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-white">{profile.role}</div>
                      <div className="mt-1 text-sm text-white/65">{profile.summary}</div>
                    </div>
                    {active && <CheckCircle2 className="h-5 w-5 text-[var(--color-accent)]" />}
                  </div>
                  <div className="mt-3 text-[11px] uppercase tracking-[0.12em] text-white/45">
                    {profile.email}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-gray-200)] bg-white p-6 shadow-lg sm:p-8">
          <div className="mb-5 inline-flex rounded-lg border border-[var(--color-gray-200)] bg-white p-2 shadow-sm">
            <BrandLogo variant="boxed" imageClassName="h-14" />
          </div>

          <div className="rounded-lg bg-[var(--color-gray-100)] p-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-gray-500)]">
              Access credentials
            </div>
            <div className="mt-3 grid gap-2 text-sm text-[var(--color-gray-600)]">
              <div>Email: {selectedProfile.email}</div>
              <div>Use the assigned admin password for this role.</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Field label="Role">
              <select
                className={inputClassName}
                value={role}
                onChange={(event) => applyProfile(event.target.value as AdminRole)}
              >
                {adminAccessProfiles.map((profile) => (
                  <option key={profile.role} value={profile.role}>
                    {profile.role}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Email">
              <input
                className={inputClassName}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
              />
            </Field>
            <Field label="Password">
              <input
                className={inputClassName}
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
            </Field>
            <Button type="submit" className="mt-4 h-11 w-full rounded-md px-6">
              Enter Dashboard
            </Button>
          </form>
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
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-gray-500)]">
        {label}
      </div>
      {children}
    </label>
  );
}

const inputClassName =
  "h-11 w-full rounded-md border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-3 text-sm outline-none focus:border-[var(--color-accent)]";
