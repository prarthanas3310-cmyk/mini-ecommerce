import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-5">
        <Compass size={28} className="text-teal-500" />
      </div>
      <h1 className="font-display text-3xl font-semibold text-ink mb-2">
        Page not found
      </h1>
      <p className="text-ink/60 mb-6">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/" className="btn-primary">
        Back to shop
      </Link>
    </div>
  );
}
