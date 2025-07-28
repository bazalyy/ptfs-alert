const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Your API endpoint to get callsigns
app.get('/callsigns', async (req, res) => {
  try {
    // Fetch aircraft data from ATC24 API
    const response = await axios.get('https://24data.ptfs.app/acft-data');

    // response.data is an object with callsigns as keys
    const aircraftData = response.data;

    // Extract callsign keys as array
    const callsigns = Object.keys(aircraftData);

    res.json(callsigns);
  } catch (error) {
    console.error('Error fetching callsigns from API:', error.message);
    res.status(500).json({ error: 'Failed to fetch callsigns' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
