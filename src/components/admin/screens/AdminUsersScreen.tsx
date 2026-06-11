import { ShieldCheck, Users2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusPill, SurfaceCard } from "@/components/admin/AdminUi";
import { adminAccessProfiles } from "@/data/admin";

const permissionsByRole = {
  "Super Admin": ["canManageFleet", "canApproveBookings", "canManageUsers", "canViewReports", "canManageSettings"],
  "Operations Manager": ["canManageFleet", "canApproveBookings", "canViewReports"],
  "Booking Agent": ["canViewReports"],
  Accountant: ["canViewReports"],
};

export function AdminUsersScreen() {
  return (
    <AdminShell title="Users" description="Role-based demo admin access with permissions ready for Firebase, Supabase, or another backend auth layer.">
      <div className="grid gap-4 md:grid-cols-3">
        <SurfaceCard title="Admin users" subtitle={String(adminAccessProfiles.length)}><div /></SurfaceCard>
        <SurfaceCard title="Approval roles" subtitle="2"><div /></SurfaceCard>
        <SurfaceCard title="Auth mode" subtitle="Local demo"><div /></SurfaceCard>
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        {adminAccessProfiles.map((profile) => {
          const permissions = permissionsByRole[profile.role as keyof typeof permissionsByRole] ?? [];
          return (
            <div key={profile.email} className="rounded-xl border border-[var(--color-gray-200)] bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-primary)] text-white"><Users2 className="h-5 w-5" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><span className="font-semibold text-[var(--color-primary)]">{profile.role}</span><StatusPill label="active" tone="green" /></div>
                  <div className="mt-1 text-sm text-[var(--color-gray-600)]">{profile.email}</div>
                  <div className="mt-3 text-sm text-[var(--color-gray-600)]">{profile.summary}</div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {permissions.map((permission) => <span key={permission} className="inline-flex items-center gap-1 rounded-full bg-[var(--color-gray-100)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)]"><ShieldCheck className="h-3 w-3" />{permission}</span>)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}
