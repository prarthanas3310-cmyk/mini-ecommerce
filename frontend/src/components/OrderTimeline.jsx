import { Check, X } from "lucide-react";

const STEPS = ["pending", "processing", "shipped", "delivered"];

export default function OrderTimeline({ status }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 text-clay text-xs font-mono">
        <X size={14} /> Order cancelled
      </div>
    );
  }

  const currentIndex = STEPS.indexOf(status || "pending");

  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => {
        const done = i <= currentIndex;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                  done ? "bg-teal-500 text-white" : "bg-ink/10 text-ink/30"
                }`}
              >
                {done ? <Check size={11} /> : <span className="w-1.5 h-1.5 rounded-full bg-current" />}
              </div>
              <span className={`text-[10px] font-mono capitalize ${done ? "text-teal-600" : "text-ink/30"}`}>
                {step}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 flex-1 mx-1 ${i < currentIndex ? "bg-teal-500" : "bg-ink/10"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
