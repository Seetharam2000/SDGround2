const API = "https://drishti-api-hled.onrender.com";

let map;
let wards = [];
let states = [];
let riskByWard = {};
let markers = {};
let stateCircle = null;
let selectedWardId = null;
let currentMode = "wards";
let mapInitialized = false;

const els = {
  landing: document.getElementById("landing"),
  dashboard: document.getElementById("dashboard"),
  landingDataset: document.getElementById("landing-dataset"),
  backBtn: document.getElementById("back-btn"),
  panelModeLabel: document.getElementById("panel-mode-label"),
  panelTitle: document.getElementById("panel-title"),
  healthBadge: document.getElementById("health-badge"),
  refreshAllBtn: document.getElementById("refresh-all-btn"),
  datasetStats: document.getElementById("dataset-stats"),
  wardList: document.getElementById("ward-list"),
  stateSelect: document.getElementById("state-select"),
  stateSummary: document.getElementById("state-summary"),
  detailPanel: document.getElementById("detail-panel"),
  detailIndex: document.getElementById("detail-index"),
  detailName: document.getElementById("detail-name"),
  detailId: document.getElementById("detail-id"),
  detailRisk: document.getElementById("detail-risk"),
  detailGindex: document.getElementById("detail-gindex"),
  detailWater: document.getElementById("detail-water"),
  detailStation: document.getElementById("detail-station"),
  detailState: document.getElementById("detail-state"),
  detailDistrict: document.getElementById("detail-district"),
  detailDistance: document.getElementById("detail-distance"),
  detailUpdated: document.getElementById("detail-updated"),
  detailSource: document.getElementById("detail-source"),
  alertBtn: document.getElementById("alert-btn"),
  alertBox: document.getElementById("alert-box"),
  alertEn: document.getElementById("alert-en"),
  alertTe: document.getElementById("alert-te"),
  alertAudio: document.getElementById("alert-audio"),
  countSafe: document.getElementById("count-safe"),
  countModerate: document.getElementById("count-moderate"),
  countCritical: document.getElementById("count-critical"),
};

function riskClass(level) {
  return ["safe", "moderate", "critical"].includes(level) ? level : "unknown";
}

function createMarkerIcon(level) {
  const cls = riskClass(level);
  return L.divIcon({
    className: "ward-marker",
    html: `<div class="marker-dot marker-dot--${cls}"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -8],
  });
}

function initMap() {
  if (mapInitialized) {
    map.invalidateSize();
    return;
  }

  map = L.map("map", {
    zoomControl: true,
    attributionControl: false,
  }).setView([17.44, 78.45], 11);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
    maxZoom: 19,
  }).addTo(map);

  mapInitialized = true;
}

function showScreen(screen) {
  els.landing.classList.toggle("screen--active", screen === "landing");
  els.dashboard.classList.toggle("screen--active", screen === "dashboard");

  if (screen === "dashboard") {
    setTimeout(() => {
      initMap();
      if (map) map.invalidateSize();
      if (Object.keys(markers).length) placeMarkers();
    }, 80);
  }
}

function enterDashboard(mode) {
  currentMode = mode;
  showScreen("dashboard");
  setActiveTab(mode);

  if (mode === "wards") {
    els.panelModeLabel.textContent = "HYDERABAD · WARD MONITORING";
    els.panelTitle.textContent = "RISK OVERVIEW";
    if (wards.length && !selectedWardId) {
      selectedWardId = wards[0].ward_id;
    }
    if (selectedWardId) selectWard(selectedWardId);
  } else {
    els.panelModeLabel.textContent = "INDIA · STATE EXPLORER";
    els.panelTitle.textContent = "REGIONAL DATA";
    els.detailPanel.classList.add("hidden");
    if (map) map.setView([22.5, 79.0], 5, { animate: true });
  }
}

function setActiveTab(tabName) {
  document.querySelectorAll(".mode-nav__btn").forEach((btn) => {
    btn.classList.toggle("mode-nav__btn--active", btn.dataset.tab === tabName);
  });
  document.getElementById("wards-panel").classList.toggle(
    "panel-section--active",
    tabName === "wards"
  );
  document.getElementById("states-panel").classList.toggle(
    "panel-section--active",
    tabName === "states"
  );

  if (tabName === "wards") {
    els.panelModeLabel.textContent = "HYDERABAD · WARD MONITORING";
    els.panelTitle.textContent = "RISK OVERVIEW";
  } else {
    els.panelModeLabel.textContent = "INDIA · STATE EXPLORER";
    els.panelTitle.textContent = "REGIONAL DATA";
    els.detailPanel.classList.add("hidden");
  }
}

function updateSummaryCounts() {
  const counts = { safe: 0, moderate: 0, critical: 0 };
  for (const ward of wards) {
    const risk = riskByWard[ward.ward_id];
    if (risk && counts[risk.risk_level] !== undefined) {
      counts[risk.risk_level]++;
    }
  }
  els.countSafe.textContent = counts.safe;
  els.countModerate.textContent = counts.moderate;
  els.countCritical.textContent = counts.critical;
}

function renderWardList() {
  els.wardList.innerHTML = "";
  wards.forEach((ward, index) => {
    const risk = riskByWard[ward.ward_id];
    const level = risk ? riskClass(risk.risk_level) : "unknown";
    const num = String(index + 1).padStart(2, "0");

    const li = document.createElement("li");
    li.className = `item${selectedWardId === ward.ward_id ? " item--active" : ""}`;
    li.innerHTML = `
      <span class="item__num">${num}</span>
      <div>
        <div class="item__name">${ward.name}</div>
        <div class="item__meta">${ward.ward_id} · ${ward.state || "Telangana"}</div>
      </div>
      <span class="item__risk item__risk--${level}">${level}</span>
    `;
    li.addEventListener("click", () => selectWard(ward.ward_id));
    els.wardList.appendChild(li);
  });
}

function placeMarkers() {
  if (!map) return;

  for (const ward of wards) {
    const risk = riskByWard[ward.ward_id];
    const level = risk ? riskClass(risk.risk_level) : "unknown";

    if (markers[ward.ward_id]) {
      markers[ward.ward_id].setIcon(createMarkerIcon(level));
    } else {
      const marker = L.marker([ward.lat, ward.lng], {
        icon: createMarkerIcon(level),
      }).addTo(map);

      const gIndex = risk ? risk.g_index : "—";
      marker.bindPopup(
        `<strong>${ward.name.toUpperCase()}</strong><br>${ward.ward_id}<br>${level.toUpperCase()} · G-${gIndex}`
      );
      marker.on("click", () => selectWard(ward.ward_id));
      markers[ward.ward_id] = marker;
    }
  }
}

function fillRiskDetails(ward, risk, index) {
  const level = riskClass(risk.risk_level);
  els.detailIndex.textContent = String(index + 1).padStart(2, "0");
  els.detailName.textContent = ward.name.toUpperCase();
  els.detailId.textContent = `${ward.ward_id} · ${ward.state || "Telangana"}`;
  els.detailRisk.textContent = level;
  els.detailGindex.textContent = risk.g_index;
  els.detailWater.textContent = `${risk.H_current} M`;
  els.detailStation.textContent = risk.station_name || "—";
  els.detailState.textContent = risk.state_name || ward.state || "—";
  els.detailDistrict.textContent = risk.district_name || "—";
  els.detailDistance.textContent =
    risk.distance_km != null ? `${risk.distance_km} KM` : "—";
  els.detailUpdated.textContent = risk.last_updated || "—";
  els.detailSource.textContent = (risk.source || "local_dataset").toUpperCase();
}

function selectWard(wardId) {
  selectedWardId = wardId;
  const wardIndex = wards.findIndex((w) => w.ward_id === wardId);
  const ward = wards[wardIndex];
  const risk = riskByWard[wardId];

  setActiveTab("wards");
  renderWardList();
  els.detailPanel.classList.remove("hidden");
  els.alertBox.classList.add("hidden");

  if (!ward) return;

  if (risk) {
    fillRiskDetails(ward, risk, wardIndex);
  } else {
    els.detailIndex.textContent = String(wardIndex + 1).padStart(2, "0");
    els.detailName.textContent = ward.name.toUpperCase();
    els.detailId.textContent = ward.ward_id;
    els.detailRisk.textContent = "LOADING";
  }

  if (map) {
    map.setView([ward.lat, ward.lng], 12, { animate: true });
    if (markers[wardId]) markers[wardId].openPopup();
  }
}

async function fetchWards() {
  const res = await fetch(`${API}/drishti/wards`);
  if (!res.ok) throw new Error("Failed to load wards");
  wards = await res.json();
}

async function fetchStates() {
  const res = await fetch(`${API}/drishti/states`);
  if (!res.ok) throw new Error("Failed to load states");
  states = await res.json();

  els.stateSelect.innerHTML = '<option value="">Choose region…</option>';
  for (const state of states) {
    const option = document.createElement("option");
    option.value = state.state_name;
    option.textContent = `${state.state_name.toUpperCase()} · ${state.station_count} STATIONS`;
    els.stateSelect.appendChild(option);
  }
}

async function fetchDatasetStats() {
  const res = await fetch(`${API}/drishti/dataset/stats`);
  if (!res.ok) throw new Error("Failed to load dataset stats");
  const data = await res.json();

  const line = `${data.total_stations.toLocaleString()} stations · ${data.states_and_uts} states & UTs · min ${data.min_stations_per_state} per region`;
  els.datasetStats.textContent = line;
  els.landingDataset.textContent = `INDIA · ${data.total_stations.toLocaleString()} STATIONS`;
  return data;
}

async function fetchRiskForWard(ward) {
  const params = new URLSearchParams({
    ward_id: ward.ward_id,
    lat: ward.lat,
    lng: ward.lng,
  });
  if (ward.state) params.set("state", ward.state);

  const res = await fetch(`${API}/drishti/risk?${params}`);
  if (!res.ok) throw new Error(`Risk fetch failed for ${ward.ward_id}`);
  return res.json();
}

async function loadAllRisks() {
  els.refreshAllBtn.disabled = true;
  els.refreshAllBtn.textContent = "LOADING…";

  await Promise.all(
    wards.map(async (ward) => {
      riskByWard[ward.ward_id] = await fetchRiskForWard(ward);
    })
  );

  placeMarkers();
  updateSummaryCounts();
  renderWardList();

  if (selectedWardId) selectWard(selectedWardId);

  els.refreshAllBtn.disabled = false;
  els.refreshAllBtn.textContent = "REFRESH DATA →";
}

async function showStateSummary(stateName) {
  if (!stateName) {
    els.stateSummary.classList.add("hidden");
    if (stateCircle && map) {
      map.removeLayer(stateCircle);
      stateCircle = null;
    }
    return;
  }

  const res = await fetch(
    `${API}/drishti/states/${encodeURIComponent(stateName)}/summary`
  );
  if (!res.ok) throw new Error(`Failed to load summary for ${stateName}`);
  const data = await res.json();

  els.stateSummary.classList.remove("hidden");
  els.stateSummary.innerHTML = `
    <strong>${data.state_name}</strong><br>
    ${data.station_count} monitoring stations<br>
    Average depth · <strong>${data.avg_water_level_m} M</strong><br>
    Range · ${data.min_water_level_m} M – ${data.max_water_level_m} M
  `;

  if (!map) return;

  if (stateCircle) map.removeLayer(stateCircle);
  stateCircle = L.circle([data.center_lat, data.center_lng], {
    color: "#1a3a1a",
    fillColor: "#8fbc6a",
    fillOpacity: 0.18,
    weight: 1,
    opacity: 0.45,
    radius: 65000,
    className: "state-ring",
  }).addTo(map);

  map.setView([data.center_lat, data.center_lng], 7, { animate: true });
}

async function checkHealth() {
  const res = await fetch(`${API}/drishti/health`);
  const data = await res.json();
  if (data.dataset_loaded) {
    els.healthBadge.textContent = `${data.total_stations.toLocaleString()} stations loaded · system ready`;
  } else {
    els.healthBadge.textContent = "Dataset unavailable";
  }
  return data;
}

async function playAlert() {
  if (!selectedWardId) return;
  const risk = riskByWard[selectedWardId];
  if (!risk) return;

  els.alertBtn.disabled = true;
  els.alertBtn.textContent = "GENERATING…";

  try {
    const res = await fetch(`${API}/drishti/alert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ward_id: selectedWardId,
        g_index: risk.g_index,
        risk_level: risk.risk_level,
        language: "te-IN",
      }),
    });

    if (!res.ok) throw new Error("Alert request failed");
    const data = await res.json();

    els.alertBox.classList.remove("hidden");
    els.alertEn.textContent = data.english_message;
    els.alertTe.textContent = data.telugu_text;

    if (data.audio_base64) {
      els.alertAudio.src = `data:audio/wav;base64,${data.audio_base64}`;
      els.alertAudio.play().catch(() => {});
    } else {
      els.alertAudio.removeAttribute("src");
    }
  } catch (err) {
    els.alertBox.classList.remove("hidden");
    els.alertEn.textContent = "Could not generate alert.";
    els.alertTe.textContent = err.message;
  } finally {
    els.alertBtn.disabled = false;
    els.alertBtn.textContent = "PLAY TELUGU ALERT →";
  }
}

function bindEvents() {
  document.querySelectorAll("[data-enter]").forEach((btn) => {
    btn.addEventListener("click", () => enterDashboard(btn.dataset.enter));
  });

  els.backBtn.addEventListener("click", () => showScreen("landing"));

  document.querySelectorAll(".mode-nav__btn").forEach((btn) => {
    btn.addEventListener("click", () => setActiveTab(btn.dataset.tab));
  });

  els.refreshAllBtn.addEventListener("click", loadAllRisks);
  els.alertBtn.addEventListener("click", playAlert);
  els.stateSelect.addEventListener("change", (event) => {
    showStateSummary(event.target.value).catch(console.error);
  });
}

async function init() {
  bindEvents();
  await checkHealth();
  await Promise.all([fetchWards(), fetchStates(), fetchDatasetStats()]);
  await loadAllRisks();
}

init().catch((err) => {
  console.error(err);
  els.healthBadge.textContent = "System unavailable";
});
