import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const loc = useLocation();
  const links = [
    { to: "/", label: "Map" },
    { to: "/report", label: "Report Issue" },
    { to: "/dashboard", label: "Authority" },
    { to: "/login", label: "Login" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[2000] bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
      <span className="font-black text-white text-lg">SDGround</span>
      <div className="flex gap-2">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`text-sm font-medium px-3 py-1 rounded-lg transition-all ${
              loc.pathname === l.to
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}