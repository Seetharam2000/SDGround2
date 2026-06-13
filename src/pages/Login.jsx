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
  const [loginMode, setLoginMode] = useState(null);
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
      navigate("/home");
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

  // SCREEN 1: Role picker
  if (loginMode === null) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-gray-900 rounded-2xl p-6 text-white">
          <h1 className="text-2xl font-black mb-1">SDGround</h1>
          <p className="text-gray-400 text-sm mb-8">Sign in to continue</p>

          <button
            onClick={() => setLoginMode("user")}
            className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-4 rounded-xl mb-3 flex items-center justify-center gap-2 text-lg"
          >
            👤 Login as Citizen
          </button>

          <button
            onClick={() => navigate("/authority-login")}
            className="w-full bg-purple-700 hover:bg-purple-800 font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-lg"
          >
            🏛️ Login as Authority
          </button>
        </div>
      </div>
    );
  }

  // SCREEN 2: Citizen login form
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-gray-900 rounded-2xl p-6 text-white">

        <button
          onClick={() => setLoginMode(null)}
          className="text-gray-400 text-sm mb-4 hover:text-white flex items-center gap-1"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-black mb-1">SDGround</h1>
        <p className="text-gray-400 text-sm mb-6">Sign in as Citizen</p>

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

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-gray-700" />
          <span className="text-gray-500 text-xs">or</span>
          <div className="flex-1 h-px bg-gray-700" />
        </div>

        <button
          onClick={loginWithGoogle}
          className="w-full bg-white text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.5-2.6 4.6-4.8 6l6.2 5.2C40.2 35.7 44 30.3 44 24c0-1.3-.1-2.7-.4-4z"/>
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}
