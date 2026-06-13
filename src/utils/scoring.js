export function calculateSDGScore(complaints) {
  const { water = 0, garbage = 0, air = 0, road = 0, health = 0 } = complaints;
  let score = 100;
  score -= water * 3;
  score -= health * 3;
  score -= garbage * 2;
  score -= air * 2;
  score -= road * 1;
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function getScoreLabel(score) {
  if (score >= 65) return { label: "Good", color: "#22c55e" };
  if (score >= 40) return { label: "Moderate", color: "#f59e0b" };
  return { label: "Critical", color: "#ef4444" };
}