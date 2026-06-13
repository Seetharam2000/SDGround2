import { useState } from "react";
import { auth } from "../firebase/config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (email === "officer@sdground.in") navigate("/dashboard");
      else navigate("/report");
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
      navigate("/report");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-gray-900 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-black mb-1">SDGround</h1>
        <p className="text-gray-400 text-sm mb-6">Sign in to continue</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-gray-800 rounded-lg px-4 py-3 mb-3 border border-gray-700 outline-none text-white"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-gray-800 rounded-lg px-4 py-3 mb-4 border border-gray-700 outline-none text-white"
        />
        <button
          onClick={login}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 font-bold py-3 rounded-xl mb-2"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <button
          onClick={signup}
          disabled={loading}
          className="w-full bg-gray-700 hover:bg-gray-600 font-bold py-3 rounded-xl mb-4"
        >
          Create Account
        </button>
        <div className="text-center text-xs text-gray-500">
          Authority demo: officer@sdground.in / demo1234
        </div>
      </div>
    </div>
  );
}