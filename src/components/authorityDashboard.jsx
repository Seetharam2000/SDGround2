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

export default function AuthorityDashboard() {
  const [user, loadingAuth] = useAuthState(auth);
  const navigate = useNavigate();
  const [selected, setSelected] = useState(WARDS[2]); // Default to critical ward
  const [complaints, setComplaints] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(false);
  const [aiReport, setAiReport] = useState(WARDS[2].aiSummary);
  const [aiSuggestedAction, setAiSuggestedAction] = useState(WARDS[2].suggestedAction);
  const [loadingAI, setLoadingAI] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
  if (
    !loadingAuth &&
    (!user || user.email !== "authority@sdground.com")
  ) {
    toast.error("Authority access only");
    navigate("/authority-login");
  }
}, [user, loadingAuth, navigate]);
  // Load complaints for selected ward in real time
  useEffect(() => {
    if (!selected) return;
    setLoadingComplaints(true);

    const q = query(
      collection(db, "complaints"),
      where("wardId", "==", selected.id),
      where("status", "==", "open")
    );

    const unsub = onSnapshot(q, (snap) => {
      setComplaints(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
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
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
      Loading...
    </div>
  );
}

//if (!user || user.email !== "authority@sdground.com") {
  //return null;
//}

  return (
    <div className="min-h-screen bg-gray-950 text-white flex pt-14">
      {/* Ward list sidebar */}
      <div className="w-72 bg-gray-900 border-r border-gray-800 overflow-y-auto flex-shrink-0">
        <div className="p-4 border-b border-gray-800">
          <h2 className="font-black text-lg">Authority Panel</h2>
          <p className="text-gray-400 text-xs mt-0.5">Sorted by urgency</p>
        </div>

        {sorted.map((ward) => {
          const { color } = getScoreLabel(ward.sdgScore);
          const isActive = selected?.id === ward.id;
          return (
            <div
              key={ward.id}
              onClick={() => handleSelectWard(ward)}
              className={`p-4 border-b border-gray-800 cursor-pointer transition-colors ${
                isActive ? "bg-gray-800" : "hover:bg-gray-850"
              }`}
            >
              <div className="text-sm font-medium">{ward.name}</div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-2xl font-black" style={{ color }}>
                  {ward.sdgScore}
                  <span className="text-gray-600 text-sm font-normal">/100</span>
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${PRIORITY_COLOR[ward.priority]}`}
                >
                  {ward.priority}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {selected && (
          <>
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-black">{selected.name}</h1>
                <p className="text-gray-400 text-sm">
                  SDG Score:{" "}
                  <span
                    className="font-bold"
                    style={{ color: getScoreLabel(selected.sdgScore).color }}
                  >
                    {selected.sdgScore}/100
                  </span>
                </p>
              </div>
              <button
                onClick={generateAI}
                disabled={loadingAI}
                className="bg-purple-700 hover:bg-purple-600 disabled:bg-gray-700 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
              >
                {loadingAI ? "Generating…" : "🤖 Refresh AI Report"}
              </button>
            </div>

            {/* Complaint stats grid */}
            <div className="grid grid-cols-5 gap-3 mb-6">
              {Object.entries(selected.complaints).map(([k, v]) => (
                <div key={k} className="bg-gray-900 rounded-xl p-4 text-center border border-gray-800">
                  <div className="text-2xl font-black text-white">{v}</div>
                  <div className="text-gray-400 text-xs capitalize mt-1">{k}</div>
                </div>
              ))}
            </div>

            {/* AI Report card */}
            <div className="bg-gray-900 rounded-2xl p-5 mb-6 border border-purple-900">
              <div className="text-xs text-purple-300 uppercase tracking-widest mb-2">
                🤖 AI Report
              </div>
              <p className="text-white leading-relaxed text-sm">
                {loadingAI ? "Generating AI report…" : aiReport}
              </p>
              {aiSuggestedAction && (
                <div className="mt-3 pt-3 border-t border-purple-900">
                  <span className="text-yellow-400 text-xs font-bold">Suggested Action: </span>
                  <span className="text-yellow-100 text-xs">{aiSuggestedAction}</span>
                </div>
              )}
            </div>

            {/* Live complaints */}
            <h3 className="font-bold mb-3 text-sm text-gray-300 uppercase tracking-widest">
              Live Open Complaints ({complaints.length})
            </h3>

            {loadingComplaints ? (
              <p className="text-gray-500 text-sm">Loading complaints…</p>
            ) : complaints.length === 0 ? (
              <div className="bg-gray-900 rounded-xl p-6 text-center border border-gray-800">
                <p className="text-gray-500 text-sm">No open complaints in Firestore yet.</p>
                <p className="text-gray-600 text-xs mt-1">
                  Seeded data shown above. Submit a complaint via /report to see it here.
                </p>
              </div>
            ) : (
              complaints.map((c) => (
                <div
                  key={c.id}
                  className="bg-gray-900 rounded-xl p-4 mb-3 flex items-start justify-between border border-gray-800"
                >
                  <div className="flex-1 mr-3">
                    <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full capitalize font-medium">
                      {c.category}
                    </span>
                    <p className="text-sm text-gray-300 mt-2">{c.description}</p>
                    {c.imageUrl && (
                      <img
                        src={c.imageUrl}
                        alt="Evidence"
                        className="mt-2 rounded-lg max-h-24 object-cover"
                      />
                    )}
                  </div>
                  <button
                    onClick={() => resolveComplaint(c.id)}
                    className="text-xs bg-green-800 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-bold transition-colors flex-shrink-0"
                  >
                    Resolve ✓
                  </button>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
