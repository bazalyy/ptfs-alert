const callsignSelect = document.getElementById('callsign');
const alertsDiv = document.getElementById('alerts');

// Load callsigns from server
async function loadCallsigns() {
  try {
    const response = await fetch('/callsigns');
    const callsigns = await response.json();

    // Clear existing options
    callsignSelect.innerHTML = '';

    if (callsigns.length === 0) {
      const option = document.createElement('option');
      option.textContent = 'No callsigns available';
      callsignSelect.appendChild(option);
      return;
    }

    // Populate dropdown
    callsigns.forEach(callsign => {
      const option = document.createElement('option');
      option.value = callsign;
      option.textContent = callsign;
      callsignSelect.appendChild(option);
    });

  } catch (error) {
    console.error('Error loading callsigns:', error);
    callsignSelect.innerHTML = '<option>Error loading callsigns</option>';
  }
}

// Run on page load
window.addEventListener('DOMContentLoaded', loadCallsigns);
