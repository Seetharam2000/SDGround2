import { useState } from "react";
import { auth } from "../firebase/config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const googleProvider = new GoogleAuthProvider();

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/home");
    } catch (e) {
      toast.error(e.message);
    }
  };

  const login = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (email === "officer@sdground.in") navigate("/dashboard");
      else navigate("/home");
    } catch (e) {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const signup = async () => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Account created successfully");
      navigate("/home");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Left branding panel — hidden on mobile */}
      <div className="hidden md:flex flex-col justify-between w-1/2 p-12 border-r border-gray-800">
        <span className="text-xs tracking-[0.3em] uppercase text-gray-500">SDGround</span>
        <div>
          <h1 className="text-[clamp(3rem,6vw,6rem)] font-black leading-[0.9] tracking-tighter uppercase mb-6">
            Civic<br />Intelligence<br />Platform
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
            Monitor ward health, submit complaints, and track Hyderabad's SDG progress in real time.
          </p>
        </div>
        <span className="text-xs text-gray-700 tracking-widest uppercase">Hyderabad · 2025</span>
      </div>

      {/* Right auth panel */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 w-full max-w-md mx-auto md:mx-0">
        <h2 className="text-2xl font-black tracking-tight uppercase mb-1">Sign In</h2>
        <p className="text-gray-500 text-sm mb-10">Access your civic dashboard</p>

        <div className="space-y-3 mb-6">
          <input
            type="email"
            placeholder="Email address"
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
          onClick={login}
          disabled={loading}
          className="w-full bg-white text-black text-xs font-bold tracking-[0.2em] uppercase py-4 mb-3 hover:bg-gray-200 disabled:bg-gray-700 disabled:text-gray-400 transition-colors"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <button
          onClick={signup}
          disabled={loading}
          className="w-full border border-gray-700 text-white text-xs font-bold tracking-[0.2em] uppercase py-4 mb-8 hover:border-white disabled:opacity-40 transition-colors"
        >
          Create Account
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-800" />
          <span className="text-gray-600 text-xs tracking-widest uppercase">or</span>
          <div className="flex-1 h-px bg-gray-800" />
        </div>

        <button
          onClick={loginWithGoogle}
          className="w-full border border-gray-700 text-white text-xs font-bold tracking-[0.2em] uppercase py-4 mb-10 hover:border-white transition-colors flex items-center justify-center gap-3"
        >
          <svg width="16" height="16" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.5-2.6 4.6-4.8 6l6.2 5.2C40.2 35.7 44 30.3 44 24c0-1.3-.1-2.7-.4-4z"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-xs text-gray-700">
          Authority demo: officer@sdground.in / demo1234
        </p>
      </div>
    </div>
  );
}