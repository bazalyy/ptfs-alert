const express = require("express");
const axios = require("axios");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/acft-data", async (req, res) => {
  try {
    const response = await axios.get("https://24data.ptfs.app/acft-data");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch aircraft data" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
