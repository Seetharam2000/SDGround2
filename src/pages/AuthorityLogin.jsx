import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AuthorityLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Authority login successful");
      navigate("/authority");
    } catch (err) {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">

      {/* Left branding panel */}
      <div className="hidden md:flex flex-col justify-between w-1/2 p-12 border-r border-gray-800">
        <span className="text-xs tracking-[0.3em] uppercase text-gray-500">SDGround</span>
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-6">
            Restricted Access
          </p>
          <h1 className="text-[clamp(3rem,6vw,6rem)] font-black leading-[0.9] tracking-tighter uppercase mb-6">
            Authority<br />Portal
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
            Access is restricted to verified municipal officers and GHMC authority accounts only.
          </p>
        </div>
        <span className="text-xs text-gray-700 tracking-widest uppercase">
          Hyderabad · 2025
        </span>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 max-w-md mx-auto md:mx-0 w-full">
        <p className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-2">
          Restricted
        </p>
        <h2 className="text-2xl font-black tracking-tight uppercase mb-1">
          Authority Login
        </h2>
        <p className="text-gray-500 text-sm mb-10">
          Municipal officers only
        </p>

        <div className="space-y-3 mb-6">
          <input
            type="email"
            placeholder="Authority email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border border-gray-800 px-4 py-4 text-sm text-white placeholder-gray-600 outline-none focus:border-gray-400 transition-colors"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border border-gray-800 px-4 py-4 text-sm text-white placeholder-gray-600 outline-none focus:border-gray-400 transition-colors"
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-white text-black text-xs font-bold tracking-[0.2em] uppercase py-4 mb-6 hover:bg-gray-200 disabled:bg-gray-800 disabled:text-gray-600 transition-colors"
        >
          {loading ? "Verifying…" : "Login"}
        </button>

        <div className="border-t border-gray-800 pt-6">
          <p className="text-xs text-gray-700 tracking-widest uppercase text-center">
            Demo: officer@sdground.in / demo1234
          </p>
        </div>
      </div>

    </div>
  );
}