import { useEffect, useState } from "react";
import {
  Building2,
  CheckCircle2,
  Circle,
  Landmark,
  Smartphone,
} from "lucide-react";

type ManualPaymentSectionProps = {
  amount: number;
  bookingRef: string;
  customerName: string;
  onPaymentMethodSelected: (method: string) => void;
  onPaymentConfirmed: () => void;
};

type PaymentMethodCard = {
  id: string;
  label: string;
  sublabel: string;
  icon: typeof Smartphone;
  borderClass: string;
  tintClass: string;
  badgeClass: string;
  buttonClass: string;
  confirmLabel: string;
};

const MOBILE_MONEY_NUMBER = "+260 972 826 350";
const USSD_CODE = "*115#";
// TODO: Replace with the live bank name before launch.
const BANK_NAME = "[BANK_NAME]";
// TODO: Replace with the live bank account number before launch.
const ACCOUNT_NUMBER = "[ACCOUNT_NUMBER]";
// TODO: Replace with the live bank branch name before launch.
const BRANCH_NAME = "[BRANCH_NAME]";
// TODO: Replace with the live WhatsApp support number before launch.
const WHATSAPP_NUMBER = "[WHATSAPP_NUMBER]";

const paymentMethods: PaymentMethodCard[] = [
  {
    id: "MTN Mobile Money",
    label: "MTN Mobile Money",
    sublabel: "Available 24/7 on any MTN line",
    icon: Smartphone,
    borderClass: "border-[#FBBF24]",
    tintClass: "bg-[#FBBF24]/10",
    badgeClass: "bg-[#FBBF24] text-[#1F2937]",
    buttonClass: "bg-[#FBBF24] text-[#1F2937] hover:bg-[#F59E0B]",
    confirmLabel: "I have sent the payment - confirm my booking",
  },
  {
    id: "Airtel Money",
    label: "Airtel Money",
    sublabel: "Available 24/7 on any Airtel line",
    icon: Smartphone,
    borderClass: "border-[#EF4444]",
    tintClass: "bg-[#EF4444]/8",
    badgeClass: "bg-[#EF4444] text-white",
    buttonClass: "bg-[#EF4444] text-white hover:bg-[#DC2626]",
    confirmLabel: "I have sent the payment - confirm my booking",
  },
  {
    id: "Zamtel Money",
    label: "Zamtel Money",
    sublabel: "Available 24/7 on any Zamtel line",
    icon: Smartphone,
    borderClass: "border-[#16A34A]",
    tintClass: "bg-[#16A34A]/8",
    badgeClass: "bg-[#16A34A] text-white",
    buttonClass: "bg-[#16A34A] text-white hover:bg-[#15803D]",
    confirmLabel: "I have sent the payment - confirm my booking",
  },
  {
    id: "Bank Transfer",
    label: "Bank Transfer",
    sublabel: "Same-day or next business day",
    icon: Landmark,
    borderClass: "border-[#1A7FD4]",
    tintClass: "bg-[#1A7FD4]/8",
    badgeClass: "bg-[#1A7FD4] text-white",
    buttonClass: "bg-[#1A7FD4] text-white hover:bg-[#1565B0]",
    confirmLabel: "I have made the transfer - confirm my booking",
  },
  {
    id: "Pay on Pickup",
    label: "Pay on Pickup",
    sublabel: "Available for verified corporate accounts only",
    icon: Building2,
    borderClass: "border-[#7C3AED]",
    tintClass: "bg-[#7C3AED]/8",
    badgeClass: "bg-[#7C3AED] text-white",
    buttonClass: "bg-[#7C3AED] text-white hover:bg-[#6D28D9]",
    confirmLabel: "Confirm booking - invoice to my account",
  },
];

export default function ManualPaymentSection({
  amount,
  bookingRef,
  customerName,
  onPaymentMethodSelected,
  onPaymentConfirmed,
}: ManualPaymentSectionProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>(paymentMethods[0].id);
  const [isConfirming, setIsConfirming] = useState(false);
  const [showPendingMessage, setShowPendingMessage] = useState(false);

  useEffect(() => {
    onPaymentMethodSelected(paymentMethods[0].id);
    // The default method only needs to be registered once when the section mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMethodSelect = (method: string) => {
    if (isConfirming) return;
    setSelectedMethod(method);
    setShowPendingMessage(false);
    onPaymentMethodSelected(method);
  };

  const handleConfirm = () => {
    if (isConfirming) return;
    setIsConfirming(true);
    setShowPendingMessage(true);
    onPaymentConfirmed();
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      {paymentMethods.map((method) => {
        const selected = selectedMethod === method.id;
        const Icon = method.icon;

        return (
          <div
            key={method.id}
            className={`cursor-pointer rounded-xl bg-white transition-all duration-300 ${selected ? `border-2 ${method.borderClass} ${method.tintClass}` : "border border-gray-200"}`}
            onClick={() => handleMethodSelect(method.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleMethodSelect(method.id);
              }
            }}
          >
            <div className="flex items-center gap-4 p-5">
              <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${method.tintClass}`}>
                <Icon className="h-6 w-6 text-slate-900" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-base font-semibold text-slate-900">{method.label}</div>
                <div className="mt-1 text-sm text-slate-500">{method.sublabel}</div>
              </div>
              <div className="shrink-0 text-slate-400">
                {selected ? <CheckCircle2 className="h-6 w-6 text-slate-900" /> : <Circle className="h-6 w-6" />}
              </div>
            </div>

            <div className={`overflow-hidden px-5 transition-[max-height,opacity] duration-300 ease-out ${selected ? "max-h-[720px] pb-5 opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="rounded-xl border border-white/60 bg-white/80 p-5">
                {method.id !== "Bank Transfer" && method.id !== "Pay on Pickup" ? (
                  <div className="space-y-5">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Send payment to</div>
                      <div className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{MOBILE_MONEY_NUMBER}</div>
                      <div className="mt-1 text-sm text-slate-500">Use {bookingRef} as the payment reference for {customerName}.</div>
                    </div>

                    <ol className="space-y-3">
                      {[
                        `Dial ${USSD_CODE} on your ${method.label.replace(" Money", "")} line`,
                        'Select "Send Money"',
                        `Enter this number: ${MOBILE_MONEY_NUMBER}`,
                        `Enter amount ${formatKwacha(amount)} and use ${bookingRef} as the reference`,
                        "Confirm with your PIN and keep the SMS confirmation",
                      ].map((step, index) => (
                        <li key={step} className="flex gap-3 rounded-xl bg-slate-50 p-3">
                          <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${method.badgeClass}`}>{index + 1}</span>
                          <span className="text-sm leading-6 text-slate-700">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : null}

                {method.id === "Bank Transfer" ? (
                  <div className="space-y-5">
                    <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                      <DetailRow label="Bank Name" value={BANK_NAME} />
                      <DetailRow label="Account Name" value="Shark Car Hire Limited" />
                      <DetailRow label="Account Number" value={ACCOUNT_NUMBER} />
                      <DetailRow label="Branch" value={BRANCH_NAME} />
                      <DetailRow label="Reference" value={`${bookingRef} - must be used as payment reference`} />
                    </div>
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                      Use your booking reference as the payment reference. Payments without a reference will cause delays.
                    </div>
                  </div>
                ) : null}

                {method.id === "Pay on Pickup" ? (
                  <div className="space-y-5">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                      This option is available for Shark Car Hire corporate account holders only. Your booking will be confirmed and invoiced to your company account. Payment is due within 30 days of the booking date.
                    </div>
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                      Not a corporate account? Contact us to open one.
                    </div>
                    <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
                      Contact us on WhatsApp
                    </a>
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isConfirming}
                  className={`mt-6 flex w-full items-center justify-center gap-3 rounded-lg px-4 py-4 text-center text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-80 ${method.buttonClass}`}
                >
                  {isConfirming ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Processing your confirmation
                    </>
                  ) : (
                    method.confirmLabel
                  )}
                </button>

                {showPendingMessage && selected ? (
                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                    Your booking is pending confirmation. Our team will verify your payment and send you a WhatsApp confirmation within 30 minutes during business hours.
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function formatKwacha(amount: number) {
  return new Intl.NumberFormat("en-ZM", {
    style: "currency",
    currency: "ZMW",
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("ZMW", "K")
    .trim();
}

/*
Usage example:

<ManualPaymentSection
  amount={12880}
  bookingRef="SCH-20260315-0047"
  customerName="Natasha Mwila"
  onPaymentMethodSelected={(method) => console.log(method)}
  onPaymentConfirmed={() => console.log("payment confirmation requested")}
/>
*/
