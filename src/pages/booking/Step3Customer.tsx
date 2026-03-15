import type { ReactNode } from "react";
import { FormEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { BookingSummaryCard } from "@/pages/booking/BookingSummaryCard";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/use-app-store";

export default function Step3Customer() {
  const navigate = useNavigate();
  const draft = useAppStore((state) => state.bookingDraft);
  const updateCustomer = useAppStore((state) => state.updateDraftCustomer);

  const isValid =
    draft.customer.firstName &&
    draft.customer.lastName &&
    draft.customer.email &&
    draft.customer.phone &&
    draft.customer.idNumber &&
    draft.customer.privacyAccepted &&
    (draft.withDriver ||
      (draft.customer.licenseNumber && draft.customer.licenseExpiry)) &&
    (!draft.customer.createAccount ||
      (draft.customer.password &&
        draft.customer.confirmPassword &&
        draft.customer.password === draft.customer.confirmPassword));

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!isValid) return;
    navigate("/book/step-4");
  };

  return (
    <div className="space-y-6 rounded-[34px] border border-[var(--color-gray-200)] bg-white p-6 shadow-[0_20px_70px_rgba(10,22,40,0.08)] md:p-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.26em] text-[var(--color-accent)]">Booking</div>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.05em] text-[var(--color-primary)]">
            Your Details
          </h1>
          <p className="mt-3 text-[var(--color-gray-600)]">
            Tell us who is travelling and how we should contact you.
          </p>
        </div>
        <div className="text-sm text-[var(--color-gray-600)]">
          Already have an account?{" "}
          <Link to="/account/login" className="font-semibold text-[var(--color-accent)]">
            Sign in
          </Link>
        </div>
      </div>

      <BookingSummaryCard />

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="First name">
            <input
              value={draft.customer.firstName}
              onChange={(event) => updateCustomer({ firstName: event.target.value })}
              className={inputClassName}
              required
            />
          </Field>
          <Field label="Last name">
            <input
              value={draft.customer.lastName}
              onChange={(event) => updateCustomer({ lastName: event.target.value })}
              className={inputClassName}
              required
            />
          </Field>
          <Field label="Email address">
            <input
              type="email"
              value={draft.customer.email}
              onChange={(event) => updateCustomer({ email: event.target.value })}
              className={inputClassName}
              required
            />
          </Field>
          <Field label="Phone number">
            <div className="grid grid-cols-[110px_1fr] gap-3">
              <select
                value={draft.customer.countryCode}
                onChange={(event) =>
                  updateCustomer({ countryCode: event.target.value })
                }
                className={inputClassName}
              >
                <option>+260</option>
                <option>+27</option>
                <option>+44</option>
                <option>+1</option>
              </select>
              <input
                value={draft.customer.phone}
                onChange={(event) => updateCustomer({ phone: event.target.value })}
                className={inputClassName}
                placeholder="97 000 0000"
                required
              />
            </div>
          </Field>
          <Field label="ID / Passport number">
            <input
              value={draft.customer.idNumber}
              onChange={(event) => updateCustomer({ idNumber: event.target.value })}
              className={inputClassName}
              required
            />
          </Field>
          {!draft.withDriver && (
            <>
              <Field label="Driver's licence number">
                <input
                  value={draft.customer.licenseNumber}
                  onChange={(event) =>
                    updateCustomer({ licenseNumber: event.target.value })
                  }
                  className={inputClassName}
                  required
                />
              </Field>
              <Field label="Licence expiry">
                <input
                  type="date"
                  value={draft.customer.licenseExpiry}
                  onChange={(event) =>
                    updateCustomer({ licenseExpiry: event.target.value })
                  }
                  className={inputClassName}
                  required
                />
              </Field>
            </>
          )}
        </div>

        <Field label="Special requests">
          <textarea
            value={draft.customer.specialRequests}
            onChange={(event) =>
              updateCustomer({ specialRequests: event.target.value })
            }
            className={`${inputClassName} min-h-[150px] resize-none py-4`}
            placeholder="Timing notes, vehicle presentation requests, luggage, or trip handling instructions."
          />
        </Field>

        <div className="rounded-[28px] bg-[var(--color-gray-100)] p-5">
          <label className="flex items-start gap-4">
            <input
              type="checkbox"
              checked={draft.customer.createAccount}
              onChange={(event) =>
                updateCustomer({ createAccount: event.target.checked })
              }
              className="mt-1 h-5 w-5 rounded border-[var(--color-gray-300)] text-[var(--color-accent)]"
            />
            <div>
              <div className="font-semibold text-[var(--color-primary)]">
                Save my details for future bookings
              </div>
              <div className="mt-1 text-sm text-[var(--color-gray-600)]">
                Create an account so your next booking is faster.
              </div>
            </div>
          </label>
          {draft.customer.createAccount && (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field label="Password">
                <input
                  type="password"
                  value={draft.customer.password}
                  onChange={(event) => updateCustomer({ password: event.target.value })}
                  className={inputClassName}
                  required
                />
              </Field>
              <Field label="Confirm password">
                <input
                  type="password"
                  value={draft.customer.confirmPassword}
                  onChange={(event) =>
                    updateCustomer({ confirmPassword: event.target.value })
                  }
                  className={inputClassName}
                  required
                />
              </Field>
            </div>
          )}
        </div>

        <label className="flex items-start gap-4 rounded-[28px] border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] p-5">
          <input
            type="checkbox"
            checked={draft.customer.privacyAccepted}
            onChange={(event) =>
              updateCustomer({ privacyAccepted: event.target.checked })
            }
            className="mt-1 h-5 w-5 rounded border-[var(--color-gray-300)] text-[var(--color-accent)]"
          />
          <div className="text-sm text-[var(--color-gray-600)]">
            I agree to the privacy policy, booking terms, and document handling
            requirements for this reservation.
          </div>
        </label>

        {!isValid && (
          <div className="rounded-[24px] border border-[var(--color-warning)]/20 bg-[var(--color-warning)]/10 px-4 py-3 text-sm text-[var(--color-primary)]">
            Complete all required customer details, document fields, and privacy consent
            before continuing.
          </div>
        )}

        <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row">
          <Button variant="secondary" className="rounded-full" onClick={() => navigate("/book/step-2")} type="button">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Button className="rounded-full" type="submit" disabled={!isValid}>
            Review & Confirm
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
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
