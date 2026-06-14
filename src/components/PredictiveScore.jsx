import { useState } from "react";
import { getRecentComplaints, getTrend } from "../utils/predictScore";

export default function PredictiveScore({ ward }) {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const generatePrediction = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getRecentComplaints(ward.id);

      const prompt = `You are an urban SDG analyst. Analyze this ward data and predict its SDG score in 30 days.

Ward: ${ward.name}
Current SDG Score: ${ward.sdgScore}/100 (higher = better)
Current complaint counts: Water=${ward.complaints.water}, Garbage=${ward.complaints.garbage}, Air=${ward.complaints.air}, Roads=${ward.complaints.roads}, Health=${ward.complaints.health}

Last 30 days Firestore complaints: ${data.total} total
Recent 15 days by category: ${JSON.stringify(data.recentCounts)}
Older 15 days by category: ${JSON.stringify(data.olderCounts)}
Complaint growth rate: ${data.growthRate > 0 ? "+" : ""}${data.growthRate} complaints
Recent descriptions: ${data.descriptions.join(" | ") || "None yet"}

Respond ONLY with a valid JSON object, no markdown, no explanation:
{
  "predictedScore": <number 0-100>,
  "confidence": <"low"|"medium"|"high">,
  "reasoning": "<2 sentences max>",
  "topRisk": "<single biggest risk category>",
  "recommendation": "<one specific action>"
}`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const result = await response.json();
      const text = result.content[0].text;
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setPrediction({ ...parsed, complaintData: data });
    } catch (err) {
      console.error(err);
      setError("Prediction unavailable. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const trend = prediction
    ? getTrend(ward.sdgScore, prediction.predictedScore)
    : null;

  return (
    <div className="border-t border-gray-800 pt-8 mt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-1">
            AI Prediction
          </p>
          <h3 className="text-sm font-black uppercase tracking-tight">
            30-Day SDG Forecast
          </h3>
        </div>
        <button
          onClick={generatePrediction}
          disabled={loading}
          className="border border-gray-700 hover:border-white text-white text-xs font-bold tracking-[0.2em] uppercase px-4 py-2 transition-colors disabled:opacity-40"
        >
          {loading ? "Predicting…" : "Generate Forecast →"}
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-400 tracking-widest uppercase">{error}</p>
      )}

      {prediction && trend && (
        <div className="flex flex-col gap-px bg-gray-800">

          {/* Score comparison */}
          <div className="bg-black px-6 py-5 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs tracking-widest uppercase text-gray-600 mb-1">
                Current
              </p>
              <p className="text-3xl font-black">{ward.sdgScore}</p>
              <p className="text-xs text-gray-600">/100</p>
            </div>
            <div className="text-center flex flex-col items-center justify-center">
              <p
                className="text-2xl font-black"
                style={{ color: trend.color }}
              >
                {trend.arrow}
              </p>
              <p
                className="text-xs tracking-widest uppercase font-bold mt-1"
                style={{ color: trend.color }}
              >
                {trend.label}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs tracking-widest uppercase text-gray-600 mb-1">
                Predicted
              </p>
              <p
                className="text-3xl font-black"
                style={{ color: trend.color }}
              >
                {prediction.predictedScore}
              </p>
              <p className="text-xs text-gray-600">/100</p>
            </div>
          </div>

          {/* Confidence */}
          <div className="bg-black px-6 py-4 flex justify-between items-center">
            <p className="text-xs tracking-widest uppercase text-gray-500">
              Confidence
            </p>
            <p className="text-xs font-bold tracking-widest uppercase text-white">
              {prediction.confidence}
            </p>
          </div>

          {/* Top risk */}
          <div className="bg-black px-6 py-4 flex justify-between items-center">
            <p className="text-xs tracking-widest uppercase text-gray-500">
              Top Risk
            </p>
            <p className="text-xs font-bold tracking-widest uppercase text-white">
              {prediction.topRisk}
            </p>
          </div>

          {/* Reasoning */}
          <div className="bg-black px-6 py-5">
            <p className="text-xs tracking-widest uppercase text-gray-500 mb-2">
              Analysis
            </p>
            <p className="text-sm text-gray-300 leading-relaxed">
              {prediction.reasoning}
            </p>
          </div>

          {/* Recommendation */}
          <div className="bg-black px-6 py-5 border-t border-gray-800">
            <p className="text-xs tracking-widest uppercase text-gray-500 mb-2">
              Recommended Action
            </p>
            <p className="text-sm text-white leading-relaxed font-medium">
              {prediction.recommendation}
            </p>
          </div>

          {/* Complaint trend */}
          <div className="bg-black px-6 py-5">
            <p className="text-xs tracking-widest uppercase text-gray-500 mb-3">
              Complaint Trend (30 days)
            </p>
            <div className="grid grid-cols-5 gap-px bg-gray-800">
              {Object.entries(prediction.complaintData.recentCounts).map(([cat, count]) => (
                <div key={cat} className="bg-black px-3 py-3 text-center">
                  <p className="text-lg font-black">{count}</p>
                  <p className="text-xs text-gray-600 uppercase tracking-widest mt-1">
                    {cat}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}