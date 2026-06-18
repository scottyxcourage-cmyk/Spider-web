const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.static(__dirname));

const API_KEY = "00abfeff5aca77b5e8ab34f08bd95109";
console.log("USING API KEY:", API_KEY);

app.get("/api/trending", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json(error.response?.data || error.message);
  }
});

app.listen(3000, () => {
  console.log("SpiderHub running on port 3000");
});
