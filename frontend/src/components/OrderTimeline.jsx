import { Check, X } from "lucide-react";

const STEPS = ["pending", "processing", "shipped", "delivered"];

export default function OrderTimeline({ status }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 text-red-400 text-xs font-medium">
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
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${
                  done
                    ? "bg-[#D4AF37] text-black"
                    : "bg-[#0D0D0D] border border-[#2C2C2C] text-gray-600"
                }`}
              >
                {done ? (
                  <Check size={11} />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                )}
              </div>
              <span
                className={`text-[10px] font-medium capitalize ${
                  done ? "text-[#D4AF37]" : "text-gray-600"
                }`}
              >
                {step}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-1 transition-colors duration-300 ${
                  i < currentIndex ? "bg-[#D4AF37]" : "bg-[#2C2C2C]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}