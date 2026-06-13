// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";

export default function Navbar() {
  const loc = useLocation();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  if (!user) return null;

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Signed out");
    navigate("/");
  };

  const links = [
    { to: "/home", label: "Home" },
    { to: "/map", label: "Map" },
    { to: "/report", label: "Report Issue" },
    { to: "/dashboard", label: "Authority" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[2000] bg-gray-900 border-b border-gray-800 px-5 h-14 flex items-center justify-between">
      <Link to="/home" className="font-black text-white text-lg tracking-tight">
        SDGround
      </Link>

      <div className="flex items-center gap-1">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
              loc.pathname === l.to
                ? "bg-indigo-600 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            {l.label}
          </Link>
        ))}

        <button
          onClick={handleLogout}
          className="ml-2 text-sm font-medium px-3 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}