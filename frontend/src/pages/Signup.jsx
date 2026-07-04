import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [focusField, setFocusField] = useState(null);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await signup(name, email, password);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  const field = (name_) => ({
    onFocus: () => setFocusField(name_),
    onBlur: () => setFocusField(null),
  });

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Ambient gold glow */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Glass card */}
        <div className="bg-[#171717]/80 backdrop-blur-xl border border-[#2C2C2C] rounded-3xl p-8 sm:p-10 shadow-2xl">
          <span className="uppercase tracking-[4px] text-[#D4AF37] text-xs">
            Join us
          </span>

          <h1 className="text-3xl font-bold text-white mt-3 mb-2">
            Create your account
          </h1>

          <p className="text-gray-400 mb-8">
            Sign up to start shopping with us.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="relative">
              <label
                className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                  focusField === "name" || name
                    ? "-top-2.5 text-xs bg-[#171717] px-1 text-[#D4AF37]"
                    : "top-3.5 text-gray-500"
                }`}
              >
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                {...field("name")}
                required
                className="w-full bg-[#0D0D0D] border border-[#2C2C2C] rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#D4AF37] transition-colors duration-200"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <label
                className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                  focusField === "email" || email
                    ? "-top-2.5 text-xs bg-[#171717] px-1 text-[#D4AF37]"
                    : "top-3.5 text-gray-500"
                }`}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                {...field("email")}
                required
                className="w-full bg-[#0D0D0D] border border-[#2C2C2C] rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#D4AF37] transition-colors duration-200"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label
                className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                  focusField === "password" || password
                    ? "-top-2.5 text-xs bg-[#171717] px-1 text-[#D4AF37]"
                    : "top-3.5 text-gray-500"
                }`}
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                {...field("password")}
                required
                className="w-full bg-[#0D0D0D] border border-[#2C2C2C] rounded-xl px-4 py-3.5 pr-12 text-white focus:outline-none focus:border-[#D4AF37] transition-colors duration-200"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#D4AF37] transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#D4AF37] text-black font-semibold py-3.5 rounded-xl hover:bg-[#E6C75C] transition-all duration-300 shadow-lg shadow-[#D4AF37]/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-gray-400 mt-8 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#D4AF37] font-semibold hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}