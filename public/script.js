const callsignSelect = document.getElementById("callsign");
const alertsDiv = document.getElementById("alerts");

// Create audio elements for each alert type
const sounds = {
  TCAS: new Audio("alert_tcas.mp3"),
  WINDSHEAR: new Audio("alert_windshear.mp3"),
  TERRAIN: new Audio("alert_terrain.mp3"),
  GPWS: new Audio("alert_gpws.mp3"),
};

let selectedCallsign = null;
let aircraftData = {};

callsignSelect.disabled = true;
callsignSelect.innerHTML = '<option>Loading callsigns...</option>';

// Fetch aircraft data every 3 seconds
async function fetchAircraftData() {
  try {
    const res = await fetch("/api/acft-data");
    aircraftData = await res.json();
    updateCallsignDropdown();
    checkAlerts();
  } catch (e) {
    console.error("Error fetching aircraft data:", e);
  }
}

// Populate callsign dropdown if empty
function updateCallsignDropdown() {
  if (callsignSelect.options.length <= 1) {
    callsignSelect.innerHTML = '<option value="">Select Callsign</option>';
    Object.keys(aircraftData).forEach((callsign) => {
      const option = document.createElement("option");
      option.value = callsign;
      option.textContent = callsign;
      callsignSelect.appendChild(option);
    });
    callsignSelect.disabled = false;
  }
}

// Check alerts for the selected aircraft
function checkAlerts() {
  if (!selectedCallsign || !aircraftData[selectedCallsign]) {
    alertsDiv.innerHTML = "";
    return;
  }

  const acft = aircraftData[selectedCallsign];
  const alerts = [];

  // Example alert conditions (customize as needed):
  // TCAS: altitude between 1000 and 5000 AND speed > 150 AND NOT on ground
  if (
    !acft.isOnGround &&
    acft.altitude >= 1000 &&
    acft.altitude <= 5000 &&
    acft.speed > 150
  ) {
    alerts.push("TCAS");
  }

  // WINDSHEAR: speed below 50 AND wind speed > 15 knots
  if (
    acft.speed < 50 &&
    acft.wind &&
    parseInt(acft.wind.split("/")[1]) > 15
  ) {
    alerts.push("WINDSHEAR");
  }

  // TERRAIN: altitude below 300 AND NOT on ground
  if (!acft.isOnGround && acft.altitude < 300) {
    alerts.push("TERRAIN");
  }

  // GPWS: altitude < 1000 AND speed > 100 AND descending fast (not shown in data? You can add logic)
  // We'll just check altitude & speed here as example:
  if (!acft.isOnGround && acft.altitude < 1000 && acft.speed > 100) {
    alerts.push("GPWS");
  }

  // Clear previous alerts and sounds
  alertsDiv.innerHTML = "";
  Object.values(sounds).forEach((sound) => {
    sound.pause();
    sound.currentTime = 0;
  });

  // Show alerts and play corresponding sounds
  if (alerts.length === 0) {
    alertsDiv.textContent = "No alerts.";
  } else {
    alerts.forEach((alertType) => {
      const alertEl = document.createElement("div");
      alertEl.classList.add("alert");
      alertEl.textContent = `⚠️ ${alertType} ALERT!`;
      alertsDiv.appendChild(alertEl);
      // Play sound for alert
      sounds[alertType].play().catch(() => {
        // Audio play may fail if user didn't interact yet, ignore
      });
    });
  }
}

callsignSelect.addEventListener("change", (e) => {
  selectedCallsign = e.target.value;
  checkAlerts();
});

// Initial fetch + interval
fetchAircraftData();
setInterval(fetchAircraftData, 3000);
