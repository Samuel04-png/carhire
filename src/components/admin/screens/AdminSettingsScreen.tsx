import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Save } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { SurfaceCard, TextField, inputClassName, settingsSectionTitle, textareaClassName } from "@/components/admin/AdminUi";
import { Button } from "@/components/ui/button";
import { initialAdminSettings } from "@/data/admin";
import { useAppStore } from "@/store/use-app-store";
import type { AdminSettings } from "@/types";

export function AdminSettingsScreen() {
  const adminSettings = useAppStore((state) => state.adminSettings);
  const saveAdminSettings = useAppStore((state) => state.saveAdminSettings);
  const [activeSection, setActiveSection] = useState<keyof AdminSettings>("companyProfile");
  const [draftSettings, setDraftSettings] = useState<AdminSettings>(adminSettings);

  useEffect(() => {
    setDraftSettings(adminSettings);
  }, [adminSettings]);

  const updateSection = <K extends keyof AdminSettings>(section: K, value: AdminSettings[K]) => {
    setDraftSettings((current) => ({ ...current, [section]: value }));
  };

  const save = () => {
    saveAdminSettings(draftSettings);
    toast.success("Admin settings saved locally.");
  };

  const reset = () => {
    setDraftSettings(initialAdminSettings);
    toast.success("Settings reset to seeded defaults.");
  };

  return (
    <AdminShell
      title="Settings"
      description="Control booking rules, pricing defaults, payment switches, notification copy, and the public-facing marketing seed values."
      actions={<div className="flex flex-wrap gap-3"><Button type="button" className="rounded-full" onClick={save}><Save className="mr-2 h-4 w-4" />Save Settings</Button><Button type="button" variant="secondary" className="rounded-full" onClick={reset}>Reset Defaults</Button></div>}
    >
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SurfaceCard title="Settings areas" subtitle="Jump between operational and content controls.">
          <div className="space-y-2">{[["companyProfile", "Company profile"],["bookingRules", "Booking rules"],["pricingRules", "Pricing rules"],["notifications", "Notifications"],["paymentSettings", "Payment settings"],["cms", "Website content"]].map(([key, label]) => <button key={key} type="button" onClick={() => setActiveSection(key as keyof AdminSettings)} className={`w-full rounded-[24px] border px-4 py-4 text-left transition ${activeSection === key ? "border-[var(--color-accent)] bg-[rgba(26,127,212,0.08)]" : "border-[var(--color-gray-200)] bg-white"}`}><div className="font-semibold text-[var(--color-primary)]">{label}</div><div className="mt-1 text-sm text-[var(--color-gray-600)]">Open and update this settings block.</div></button>)}</div>
        </SurfaceCard>

        <SurfaceCard title={settingsSectionTitle(activeSection)} subtitle="Changes are saved into the persistent browser store for this demo environment.">
          {activeSection === "companyProfile" && <div className="grid gap-4 md:grid-cols-2"><TextField label="Company name" value={draftSettings.companyProfile.companyName} onChange={(value) => updateSection("companyProfile", { ...draftSettings.companyProfile, companyName: value })} /><TextField label="Tagline" value={draftSettings.companyProfile.tagline} onChange={(value) => updateSection("companyProfile", { ...draftSettings.companyProfile, tagline: value })} /><TextField label="Support phone" value={draftSettings.companyProfile.supportPhone} onChange={(value) => updateSection("companyProfile", { ...draftSettings.companyProfile, supportPhone: value })} /><TextField label="Support email" value={draftSettings.companyProfile.supportEmail} onChange={(value) => updateSection("companyProfile", { ...draftSettings.companyProfile, supportEmail: value })} /><TextField label="WhatsApp URL" value={draftSettings.companyProfile.whatsappUrl} onChange={(value) => updateSection("companyProfile", { ...draftSettings.companyProfile, whatsappUrl: value })} /><TextField label="Office address" value={draftSettings.companyProfile.officeAddress} onChange={(value) => updateSection("companyProfile", { ...draftSettings.companyProfile, officeAddress: value })} /></div>}
          {activeSection === "bookingRules" && <div className="grid gap-4 md:grid-cols-2"><TextField label="Self-drive lead hours" type="number" value={String(draftSettings.bookingRules.selfDriveLeadHours)} onChange={(value) => updateSection("bookingRules", { ...draftSettings.bookingRules, selfDriveLeadHours: Number(value) })} /><TextField label="Chauffeur lead hours" type="number" value={String(draftSettings.bookingRules.chauffeurLeadHours)} onChange={(value) => updateSection("bookingRules", { ...draftSettings.bookingRules, chauffeurLeadHours: Number(value) })} /><TextField label="Hold window hours" type="number" value={String(draftSettings.bookingRules.holdWindowHours)} onChange={(value) => updateSection("bookingRules", { ...draftSettings.bookingRules, holdWindowHours: Number(value) })} /><TextField label="Tax rate" type="number" value={String(draftSettings.bookingRules.taxRate)} onChange={(value) => updateSection("bookingRules", { ...draftSettings.bookingRules, taxRate: Number(value) })} /><TextField label="Pickup window" value={draftSettings.bookingRules.defaultPickupWindow} onChange={(value) => updateSection("bookingRules", { ...draftSettings.bookingRules, defaultPickupWindow: value })} /></div>}
          {activeSection === "pricingRules" && <div className="grid gap-4 md:grid-cols-2"><TextField label="Meet and greet fee" type="number" value={String(draftSettings.pricingRules.airportMeetAndGreetFee)} onChange={(value) => updateSection("pricingRules", { ...draftSettings.pricingRules, airportMeetAndGreetFee: Number(value) })} /><TextField label="Default chauffeur rate" type="number" value={String(draftSettings.pricingRules.defaultChauffeurRate)} onChange={(value) => updateSection("pricingRules", { ...draftSettings.pricingRules, defaultChauffeurRate: Number(value) })} /><TextField label="Security deposit" type="number" value={String(draftSettings.pricingRules.securityDeposit)} onChange={(value) => updateSection("pricingRules", { ...draftSettings.pricingRules, securityDeposit: Number(value) })} /><TextField label="Corporate discount %" type="number" value={String(draftSettings.pricingRules.corporateDiscountPercent)} onChange={(value) => updateSection("pricingRules", { ...draftSettings.pricingRules, corporateDiscountPercent: Number(value) })} /><TextField label="Low availability threshold" type="number" value={String(draftSettings.pricingRules.lowAvailabilityThreshold)} onChange={(value) => updateSection("pricingRules", { ...draftSettings.pricingRules, lowAvailabilityThreshold: Number(value) })} /></div>}
          {activeSection === "notifications" && <div className="space-y-4"><label><div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">Booking confirmation template</div><textarea className={textareaClassName} value={draftSettings.notifications.bookingConfirmationTemplate} onChange={(event) => updateSection("notifications", { ...draftSettings.notifications, bookingConfirmationTemplate: event.target.value })} /></label><label><div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">Payment reminder template</div><textarea className={textareaClassName} value={draftSettings.notifications.paymentReminderTemplate} onChange={(event) => updateSection("notifications", { ...draftSettings.notifications, paymentReminderTemplate: event.target.value })} /></label><label><div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">Dispatch template</div><textarea className={textareaClassName} value={draftSettings.notifications.dispatchTemplate} onChange={(event) => updateSection("notifications", { ...draftSettings.notifications, dispatchTemplate: event.target.value })} /></label></div>}
          {activeSection === "paymentSettings" && <div className="space-y-4">{[["mobileMoneyEnabled", "Enable mobile money"],["bankTransferEnabled", "Enable bank transfer"],["cardEnabled", "Enable card payments"],["payOnPickupEnabled", "Enable pay on pickup"]].map(([key, label]) => <label key={key} className="flex items-center justify-between rounded-[24px] border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-4 py-4"><span className="text-sm font-semibold text-[var(--color-primary)]">{label}</span><input type="checkbox" checked={draftSettings.paymentSettings[key as keyof AdminSettings["paymentSettings"]] as boolean} onChange={(event) => updateSection("paymentSettings", { ...draftSettings.paymentSettings, [key]: event.target.checked })} /></label>)}<label><div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">Settlement terms</div><textarea className={textareaClassName} value={draftSettings.paymentSettings.settlementTerms} onChange={(event) => updateSection("paymentSettings", { ...draftSettings.paymentSettings, settlementTerms: event.target.value })} /></label></div>}
          {activeSection === "cms" && <div className="space-y-4"><TextField label="Hero headline" value={draftSettings.cms.heroHeadline} onChange={(value) => updateSection("cms", { ...draftSettings.cms, heroHeadline: value })} /><label><div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">Hero subheadline</div><textarea className={textareaClassName} value={draftSettings.cms.heroSubheadline} onChange={(event) => updateSection("cms", { ...draftSettings.cms, heroSubheadline: event.target.value })} /></label><TextField label="Corporate banner title" value={draftSettings.cms.corporateBannerTitle} onChange={(value) => updateSection("cms", { ...draftSettings.cms, corporateBannerTitle: value })} /><TextField label="Trust badge label" value={draftSettings.cms.trustBadgeLabel} onChange={(value) => updateSection("cms", { ...draftSettings.cms, trustBadgeLabel: value })} /></div>}
        </SurfaceCard>
      </div>
    </AdminShell>
  );
}
