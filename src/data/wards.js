export const WARDS = [
  {
    id: "ward7",
    name: "Ward 7 - Secunderabad",
    lat: 17.4399,
    lng: 78.4983,
    sdgScore: 72,
    priority: "Medium",
    aiSummary:
      "Ward 7 has moderate issues with road maintenance and scattered garbage complaints. Water supply disruptions were reported twice this week. Immediate attention to garbage pickup scheduling is recommended.",
    suggestedAction:
      "Schedule additional garbage collection runs on weekends.",
    complaints: {
      water: 4,
      garbage: 8,
      air: 2,
      roads: 6,
      health: 1,
    },
  },

  {
    id: "ward12",
    name: "Ward 12 - Begumpet",
    lat: 17.4356,
    lng: 78.4668,
    sdgScore: 55,
    priority: "High",
    aiSummary:
      "Ward 12 faces significant air quality issues near the industrial corridor alongside frequent waterlogging complaints. Road damage has increased by 40% in the last month. Multi-department coordination is urgently needed.",
    suggestedAction:
      "Deploy drainage clearing team and issue AQI advisory for residents.",
    complaints: {
      water: 10,
      garbage: 6,
      air: 14,
      roads: 9,
      health: 5,
    },
  },

  {
    id: "ward15",
    name: "Ward 15 - Kukatpally",
    lat: 17.4849,
    lng: 78.3996,
    sdgScore: 28,
    priority: "Critical",
    aiSummary:
      "CRITICAL: Ward 15 has the highest complaint density in the city. Overflowing sewage, contaminated water supply, and illegal dumping have created a public health emergency. Immediate multi-agency intervention is required.",
    suggestedAction:
      "URGENT: Deploy emergency sanitation team within 24 hours. Issue boil-water advisory.",
    complaints: {
      water: 22,
      garbage: 31,
      air: 8,
      roads: 14,
      health: 11,
    },
  },

  {
    id: "ward23",
    name: "Ward 23 - Banjara Hills",
    lat: 17.4156,
    lng: 78.4347,
    sdgScore: 88,
    priority: "Low",
    aiSummary:
      "Ward 23 is performing well across all SDG indicators. Minor road maintenance requests and two noise complaints were logged this week. Continue current maintenance schedule.",
    suggestedAction:
      "Routine maintenance cycle — no urgent action needed.",
    complaints: {
      water: 1,
      garbage: 3,
      air: 1,
      roads: 2,
      health: 0,
    },
  },

  {
    id: "ward31",
    name: "Ward 31 - LB Nagar",
    lat: 17.3474,
    lng: 78.5526,
    sdgScore: 61,
    priority: "Medium",
    aiSummary:
      "Ward 31 has consistent garbage complaints in the market area and growing reports of stray animals near the school zone. Water pressure issues were reported in 3 sub-localities. Proactive intervention advised.",
    suggestedAction:
      "Increase garbage bins near LB Nagar market. Coordinate with animal control.",
    complaints: {
      water: 7,
      garbage: 12,
      air: 3,
      roads: 5,
      health: 4,
    },
  },
];

export const PRIORITY_COLOR = {
  Critical: "bg-red-600 text-white",
  High: "bg-orange-600 text-white",
  Medium: "bg-yellow-600 text-black",
  Low: "bg-green-600 text-white",
};
