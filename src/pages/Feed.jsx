import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import UpvoteButton from "../components/UpvoteButton";

export default function Feed() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "complaints"),
      where("status", "==", "open")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      // Sort by upvotes client-side instead
      data.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
      setComplaints(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pt-14">
      <div className="max-w-2xl mx-auto px-8 py-16">

        <p className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-4">
          Community
        </p>
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-black uppercase tracking-tighter leading-none mb-3">
          Live<br />Complaints
        </h1>
        <p className="text-gray-500 text-sm mb-12">
          Upvote issues affecting your ward to prioritize them.
        </p>

        <div className="border-t border-gray-800 mb-8" />

        {loading ? (
          <p className="text-xs tracking-widest uppercase text-gray-600">
            Loading complaints…
          </p>
        ) : complaints.length === 0 ? (
          <div className="border border-gray-800 px-8 py-12 text-center">
            <p className="text-gray-500 text-sm">No open complaints yet.</p>
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
                <UpvoteButton complaint={c} />

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs border border-gray-700 px-2 py-0.5 capitalize font-bold tracking-widest uppercase text-gray-400">
                      {c.category}
                    </span>
                    <span className="text-xs text-gray-600 tracking-widest uppercase">
                      {c.wardId}
                    </span>
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}