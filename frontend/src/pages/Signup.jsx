import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-16 p-6 border rounded">
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <input className="border p-2 w-full mb-3" placeholder="Name" value={name}
        onChange={(e) => setName(e.target.value)} />
      <input className="border p-2 w-full mb-3" placeholder="Email" value={email}
        onChange={(e) => setEmail(e.target.value)} />
      <input className="border p-2 w-full mb-3" type="password" placeholder="Password"
        value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="bg-black text-white w-full py-2 rounded">Sign Up</button>
    </form>
  );
}
