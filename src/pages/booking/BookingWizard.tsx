import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Step1TripDetails from "@/pages/booking/Step1TripDetails";
import Step2Extras from "@/pages/booking/Step2Extras";
import Step3Customer from "@/pages/booking/Step3Customer";
import Step4Review from "@/pages/booking/Step4Review";

const steps = [
  { id: 1, label: "Your Trip Details", path: "/book/step-1" },
  { id: 2, label: "Your Extras", path: "/book/step-2" },
  { id: 3, label: "Your Details", path: "/book/step-3" },
  { id: 4, label: "Review & Confirm", path: "/book/step-4" },
];

export default function BookingWizard() {
  const location = useLocation();
  const currentStep =
    steps.find((step) => location.pathname.includes(step.path))?.id ?? 1;

  return (
    <div className="min-h-screen bg-[var(--color-gray-100)] pb-20 pt-28">
      <div className="sticky top-20 z-30 border-b border-[var(--color-gray-200)] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="relative grid grid-cols-4 gap-3">
            <div className="absolute left-0 right-0 top-5 h-1 rounded-full bg-[var(--color-gray-100)]" />
            <motion.div
              className="absolute left-0 top-5 h-1 rounded-full bg-[var(--color-accent)]"
              animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
            {steps.map((step) => {
              const isComplete = step.id < currentStep;
              const isCurrent = step.id === currentStep;
              return (
                <div key={step.id} className="relative z-10 text-center">
                  <div
                    className={`mx-auto grid h-10 w-10 place-items-center rounded-full border-2 text-sm font-semibold ${
                      isComplete || isCurrent
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                        : "border-[var(--color-gray-200)] bg-white text-[var(--color-gray-500)]"
                    }`}
                  >
                    {isComplete ? <Check className="h-4 w-4" /> : step.id}
                  </div>
                  <div
                    className={`mt-3 text-[11px] font-semibold uppercase tracking-[0.22em] ${
                      isCurrent ? "text-[var(--color-primary)]" : "text-[var(--color-gray-500)]"
                    }`}
                  >
                    {step.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.32 }}
          >
            <Routes>
              <Route path="step-1" element={<Step1TripDetails />} />
              <Route path="step-2" element={<Step2Extras />} />
              <Route path="step-3" element={<Step3Customer />} />
              <Route path="step-4" element={<Step4Review />} />
              <Route path="*" element={<Navigate to="step-1" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
