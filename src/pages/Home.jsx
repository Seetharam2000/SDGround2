import { Link } from "react-router-dom";
import heroImg from "../assets/hero.jpg";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white pt-14">

      {/* Hero — split layout */}
      <section className="grid md:grid-cols-2 min-h-[90vh]">
        {/* Left — text */}
        <div className="flex flex-col justify-center px-8 md:px-12 py-16">
          <p className="text-xs tracking-[0.3em] text-gray-500 uppercase mb-6">
            Hyderabad · Civic Intelligence
          </p>
          <h1 className="text-[clamp(2rem,7vw,6rem)] font-black leading-[0.85] tracking-tighter uppercase mb-10">
            SDGround
          </h1>
          <p className="text-gray-400 text-base max-w-sm leading-relaxed mb-12">
            Real-time complaint tracking across Hyderabad's wards.
            Report issues, monitor SDG scores, and hold the city accountable.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              to="/report"
              className="px-8 py-4 bg-white text-black text-xs font-bold tracking-[0.2em] uppercase hover:bg-gray-200 transition-colors"
            >
              Report Issue
            </Link>
            <Link
              to="/map"
              className="px-8 py-4 border border-gray-700 text-white text-xs font-bold tracking-[0.2em] uppercase hover:border-white transition-colors"
            >
              View Map
            </Link>
          </div>
        </div>

        {/* Right — image */}
        <div className="relative min-h-[50vh] md:min-h-full">
          <img
            src={heroImg}
            alt="Hyderabad civic issues"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
        </div>
      </section>

      <div className="border-t border-gray-800 mx-8" />

      {/* Feature Grid */}
      <section className="max-w-6xl mx-auto px-8 py-0 grid grid-cols-1 md:grid-cols-5 gap-px bg-gray-800">
        {[
          {
            to: "/map",
            num: "01",
            title: "Ward Map",
            desc: "Live SDG scores across every ward. Color-coded by urgency.",
            cta: "Explore",
          },
          {
            to: "/report",
            num: "02",
            title: "Report Issue",
            desc: "Submit complaints for water, garbage, air, roads, or health.",
            cta: "Submit",
          },
          {
            to: "/feed",
            num: "03",
            title: "Community",
            desc: "Upvote complaints affecting your ward. Most urgent rise to top.",
            cta: "Vote",
          },
          {
            to: "/dashboard",
            num: "04",
            title: "Authority Panel",
            desc: "AI-generated ward reports and live complaint dashboard.",
            cta: "Access",
          },
          {
            to: "/drishti",
            num: "05",
            title: "Drishti",
            desc: "Groundwater risk intelligence across Hyderabad's wards.",
            cta: "Launch",
          },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="bg-black p-8 group hover:bg-gray-950 transition-colors"
          >
            <p className="text-xs tracking-[0.25em] text-gray-600 uppercase mb-6">
              {item.num}
            </p>
            <h2 className="text-xl font-black uppercase tracking-tight mb-3 group-hover:text-gray-300 transition-colors">
              {item.title}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              {item.desc}
            </p>
            <div className="mt-8 text-xs tracking-[0.2em] text-gray-600 uppercase group-hover:text-white transition-colors">
              {item.cta} →
            </div>
          </Link>
        ))}
      </section>

      <div className="border-t border-gray-800 mx-8" />

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-8 py-12 grid grid-cols-4 gap-8 text-center">
        {[
          { value: "150+", label: "Wards Monitored" },
          { value: "5",    label: "SDG Categories" },
          { value: "Live", label: "Real-time Updates" },
          { value: "30d",  label: "AI SDG Forecast" },
        ].map((s) => (
          <div key={s.label}>
            <p className="text-3xl font-black tracking-tight">{s.value}</p>
            <p className="text-xs text-gray-500 tracking-[0.2em] uppercase mt-1">
              {s.label}
            </p>
          </div>
        ))}
      </section>

      <div className="border-t border-gray-800 mx-8" />

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-8 py-8 flex justify-between items-center">
        <span className="text-xs text-gray-700 tracking-widest uppercase">SDGround © 2025</span>
        <span className="text-xs text-gray-700 tracking-widest uppercase">Hyderabad, India</span>
      </footer>

    </div>
  );
}