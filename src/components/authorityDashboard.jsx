// src/components/AuthorityDashboard.jsx
import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../firebase/config";
import { WARDS, PRIORITY_COLOR } from "../data/wards";
import { getScoreLabel } from "../utils/scoring";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PredictiveScore from "./PredictiveScore";

export default function AuthorityDashboard() {
  const [user, loadingAuth] = useAuthState(auth);
  const navigate = useNavigate();
  const [selected, setSelected] = useState(WARDS[2]);
  const [complaints, setComplaints] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(false);
  const [aiReport, setAiReport] = useState(WARDS[2].aiSummary);
  const [aiSuggestedAction, setAiSuggestedAction] = useState(WARDS[2].suggestedAction);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    if (!loadingAuth && (!user || user.email !== "authority@sdground.com")) {
      toast.error("Authority access only");
      navigate("/authority-login");
    }
  }, [user, loadingAuth, navigate]);

  useEffect(() => {
    if (!selected) return;
    setLoadingComplaints(true);
    const q = query(
      collection(db, "complaints"),
      where("wardId", "==", selected.id),
      where("status", "==", "open")
    );
    const unsub = onSnapshot(q, (snap) => {
      setComplaints(
        snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
      );
      setLoadingComplaints(false);
    });
    return () => unsub();
  }, [selected]);

  const handleSelectWard = (ward) => {
    setSelected(ward);
    setAiReport(ward.aiSummary);
    setAiSuggestedAction(ward.suggestedAction);
    setComplaints([]);
  };

  const generateAI = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wardName: selected.name,
          complaints: selected.complaints,
          recentComplaints: complaints.slice(0, 8).map((c) => c.description),
        }),
      });
      const data = await res.json();
      setAiReport(data.summary);
      setAiSuggestedAction(data.suggestedAction);
      toast.success("AI report refreshed");
    } catch {
      toast.error("AI unavailable — showing cached report");
    } finally {
      setLoadingAI(false);
    }
  };

  const resolveComplaint = async (id) => {
    try {
      await updateDoc(doc(db, "complaints", id), { status: "resolved" });
      toast.success("Marked as resolved");
    } catch {
      toast.error("Failed to update");
    }
  };

  const sorted = [...WARDS].sort((a, b) => a.sdgScore - b.sdgScore);

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-xs tracking-[0.3em] uppercase text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex pt-14">

      {/* Sidebar */}
      <div className="w-64 border-r border-gray-800 overflow-y-auto flex-shrink-0">
        <div className="px-6 py-6 border-b border-gray-800">
          <p className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-1">Panel</p>
          <h2 className="font-black text-lg uppercase tracking-tight">Authority</h2>
          <p className="text-gray-600 text-xs mt-1 tracking-widest uppercase">Sorted by urgency</p>
        </div>

        {sorted.map((ward) => {
          const { color } = getScoreLabel(ward.sdgScore);
          const isActive = selected?.id === ward.id;
          return (
            <div
              key={ward.id}
              onClick={() => handleSelectWard(ward)}
              className={`px-6 py-5 border-b border-gray-800 cursor-pointer transition-colors ${
                isActive ? "bg-gray-900" : "hover:bg-gray-950"
              }`}
            >
              <div className="text-xs font-bold uppercase tracking-tight text-gray-300 mb-2">
                {ward.name}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black" style={{ color }}>
                  {ward.sdgScore}
                  <span className="text-gray-700 text-xs font-normal">/100</span>
                </span>
                <span
                  className={`text-xs px-2 py-0.5 font-bold tracking-widest uppercase ${PRIORITY_COLOR[ward.priority]}`}
                  style={{ borderRadius: 0 }}
                >
                  {ward.priority}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main panel */}
      <div className="flex-1 overflow-y-auto">
        {selected && (
          <>
            {/* Header */}
            <div className="px-10 py-8 border-b border-gray-800 flex justify-between items-start">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-2">
                  Selected Ward
                </p>
                <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">
                  {selected.name}
                </h1>
                <p className="text-gray-500 text-xs mt-2 tracking-widest uppercase">
                  SDG Score:{" "}
                  <span
                    className="font-black text-sm"
                    style={{ color: getScoreLabel(selected.sdgScore).color }}
                  >
                    {selected.sdgScore}/100
                  </span>
                </p>
              </div>
              <button
                onClick={generateAI}
                disabled={loadingAI}
                className="border border-gray-700 hover:border-white disabled:opacity-40 text-white text-xs font-bold tracking-[0.2em] uppercase px-6 py-3 transition-colors"
              >
                {loadingAI ? "Generating…" : "Refresh AI Report"}
              </button>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-5 gap-px bg-gray-800 border-b border-gray-800">
              {Object.entries(selected.complaints).map(([k, v]) => (
                <div key={k} className="bg-black px-6 py-6 text-center">
                  <div className="text-3xl font-black text-white">{v}</div>
                  <div className="text-gray-600 text-xs capitalize tracking-[0.2em] uppercase mt-1">
                    {k}
                  </div>
                </div>
              ))}
            </div>

            {/* AI Report */}
            <div className="px-10 py-8 border-b border-gray-800">
              <p className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-4">
                AI Report
              </p>
              <p className="text-white leading-relaxed text-sm max-w-2xl">
                {loadingAI ? "Generating AI report…" : aiReport}
              </p>
              {aiSuggestedAction && (
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <p className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-1">
                    Suggested Action
                  </p>
                  <p className="text-white text-sm">{aiSuggestedAction}</p>
                </div>
              )}
            </div>

            {/* Predictive Score */}
            <div className="px-10 py-8 border-b border-gray-800">
              <PredictiveScore ward={selected} />
            </div>

            {/* Live complaints */}
            <div className="px-10 py-8">
              <div className="flex items-center justify-between mb-6">
                <p className="text-xs tracking-[0.3em] uppercase text-gray-500">
                  Live Open Complaints ({complaints.length})
                </p>
                <p className="text-xs tracking-widest uppercase text-gray-600">
                  Sorted by upvotes
                </p>
              </div>

              {loadingComplaints ? (
                <p className="text-xs tracking-widest uppercase text-gray-600">
                  Loading complaints…
                </p>
              ) : complaints.length === 0 ? (
                <div className="border border-gray-800 px-8 py-12 text-center">
                  <p className="text-gray-500 text-sm">No open complaints in Firestore yet.</p>
                  <p className="text-gray-700 text-xs mt-2 tracking-widest uppercase">
                    Submit a complaint via /report to see it here.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-px bg-gray-800">
                  {complaints.map((c) => (
                    <div
                      key={c.id}
                      className="bg-black px-6 py-5 flex items-start gap-4"
                    >
                      {/* Upvote count */}
                      <div className="flex flex-col items-center gap-1 px-3 py-2 border border-gray-800 min-w-[48px]">
                        <span className="text-xs text-gray-600">△</span>
                        <span className="text-sm font-black text-white">
                          {c.upvotes || 0}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs border border-gray-700 px-2 py-0.5 capitalize font-bold tracking-widest uppercase text-gray-400">
                            {c.category}
                          </span>
                          {c.upvotes > 0 && (
                            <span className="text-xs text-gray-600 tracking-widest uppercase">
                              {c.upvotes} community {c.upvotes === 1 ? "vote" : "votes"}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">
                          {c.description}
                        </p>
                        {c.imageUrl && (
                          <img
                            src={c.imageUrl}
                            alt="Evidence"
                            className="mt-3 max-h-28 object-cover"
                          />
                        )}
                      </div>

                      {/* Resolve */}
                      <button
                        onClick={() => resolveComplaint(c.id)}
                        className="text-xs border border-gray-700 hover:border-white hover:text-white text-gray-400 px-4 py-2 font-bold tracking-[0.15em] uppercase transition-colors flex-shrink-0"
                      >
                        Resolve
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}