import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
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

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <div className="card p-6">
        <h1 className="font-display text-2xl font-semibold text-ink mb-1">Create account</h1>
        <p className="text-sm text-ink/60 mb-6">Join MiniShop to start shopping.</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input-field"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-ink/60 mt-5 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-teal-600 font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
