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

  if (
    loc.pathname === "/authority-login" ||
    loc.pathname === "/authority"
  ) {
    return null;
  }

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Signed out");
    navigate("/");
  };

  const links = [
    { to: "/home", label: "Home" },
    { to: "/map", label: "Map" },
    { to: "/report", label: "Report Issue" },
    { to: "/drishti", label: "Drishti" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[2000] bg-black border-b border-gray-800 px-8 h-14 flex items-center justify-between">
      <Link to="/home" className="font-black text-white text-sm tracking-[0.25em] uppercase">
        SDGround
      </Link>

      <div className="flex items-center gap-6">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`text-xs tracking-[0.2em] uppercase font-medium transition-colors ${
              loc.pathname === l.to
                ? "text-white border-b border-white pb-0.5"
                : "text-gray-500 hover:text-white"
            }`}
          >
            {l.label}
          </Link>
        ))}

        <button
          onClick={handleLogout}
          className="text-xs tracking-[0.2em] uppercase font-medium text-gray-500 hover:text-white transition-colors ml-4 border-l border-gray-800 pl-6"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}