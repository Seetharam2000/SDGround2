import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";

// Get complaints from last N days for a ward
export async function getRecentComplaints(wardId, days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const q = query(
    collection(db, "complaints"),
    where("wardId", "==", wardId),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);
  const complaints = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  // Split into two halves to calculate trend
  const midpoint = new Date();
  midpoint.setDate(midpoint.getDate() - days / 2);

  const recent = complaints.filter(
    (c) => c.createdAt?.toDate() > midpoint
  );
  const older = complaints.filter(
    (c) => c.createdAt?.toDate() <= midpoint
  );

  // Count by category
  const countByCategory = (list) => {
    const counts = { water: 0, garbage: 0, air: 0, roads: 0, health: 0 };
    list.forEach((c) => {
      if (counts[c.category] !== undefined) counts[c.category]++;
    });
    return counts;
  };

  return {
    total: complaints.length,
    recentCounts: countByCategory(recent),
    olderCounts: countByCategory(older),
    growthRate: recent.length - older.length,
    descriptions: complaints.slice(0, 5).map((c) => c.description),
  };
}

// Calculate trend direction
export function getTrend(currentScore, predictedScore) {
  const diff = predictedScore - currentScore;
  if (diff <= -10) return { label: "Declining Fast", color: "#ef4444", arrow: "↓↓" };
  if (diff < 0) return { label: "Declining", color: "#f97316", arrow: "↓" };
  if (diff === 0) return { label: "Stable", color: "#8a8a8a", arrow: "→" };
  if (diff <= 10) return { label: "Improving", color: "#22c55e", arrow: "↑" };
  return { label: "Improving Fast", color: "#22c55e", arrow: "↑↑" };
}