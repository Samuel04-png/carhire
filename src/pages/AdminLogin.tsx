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
    <div className="min-h-screen bg-[var(--color-primary)] px-4 py-10 sm:px-6 lg:py-16">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_1.05fr]">
        <div className="overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))] p-8 text-white shadow-[0_28px_90px_rgba(0,0,0,0.24)] sm:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]">
            <ShieldCheck className="h-4 w-4" />
            Admin access
          </div>
          <h1 className="mt-6 max-w-xl font-display text-4xl font-bold tracking-[-0.06em] text-white sm:text-5xl">
            Run bookings, fleet, dispatch, and revenue from one operations console.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/72 sm:text-lg">
            This demo login mirrors operational access levels for sales, dispatch, and finance.
            Pick a role, use its seeded email, and enter the shared demo password.
          </p>

          <div className="mt-10 grid gap-4">
            {adminAccessProfiles.map((profile) => {
              const active = profile.role === role;
              return (
                <button
                  key={profile.role}
                  type="button"
                  onClick={() => applyProfile(profile.role)}
                  className={`rounded-[28px] border px-5 py-5 text-left transition ${
                    active
                      ? "border-[var(--color-accent)] bg-white/10 shadow-[0_16px_40px_rgba(26,127,212,0.18)]"
                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-white">{profile.role}</div>
                      <div className="mt-1 text-sm text-white/65">{profile.summary}</div>
                    </div>
                    {active && <CheckCircle2 className="h-5 w-5 text-[var(--color-accent)]" />}
                  </div>
                  <div className="mt-3 text-xs uppercase tracking-[0.22em] text-white/45">
                    {profile.email}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-[36px] border border-white/10 bg-white p-7 shadow-[0_24px_90px_rgba(10,22,40,0.3)] sm:p-10">
          <div className="mb-6 inline-flex rounded-[24px] border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] p-3">
            <BrandLogo variant="boxed" imageClassName="h-14 sm:h-16" />
          </div>

          <div className="rounded-[28px] bg-[var(--color-gray-100)] p-5">
            <div className="text-xs uppercase tracking-[0.22em] text-[var(--color-gray-500)]">
              Demo credentials
            </div>
            <div className="mt-3 grid gap-2 text-sm text-[var(--color-gray-600)]">
              <div>Email: {selectedProfile.email}</div>
              <div>Password: {demoAdminPassword}</div>
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
            <Button type="submit" className="mt-4 h-14 w-full rounded-full px-8">
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
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gray-500)]">
        {label}
      </div>
      {children}
    </label>
  );
}

const inputClassName =
  "h-14 w-full rounded-2xl border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-4 outline-none focus:border-[var(--color-accent)]";
