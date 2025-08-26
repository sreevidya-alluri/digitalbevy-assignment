const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const GITHUB_API_URL = "https://api.github.com/search/repositories";

const cache = {};

app.post("/api/search", async (req, res) => {
  try {
    const { keyword } = req.body;
    if (!keyword) {
      return res.status(400).json({ error: "Keyword required" });
    }

    if (cache[keyword]) {
      return res.json({
        message: "From cache",
        items: cache[keyword].items,
      });
    }

    const githubRes = await axios.get(
      `${GITHUB_API_URL}?q=${encodeURIComponent(keyword)}&per_page=5`,
      {
        headers: { Accept: "application/vnd.github.v3+json" },
      }
    );

    const simplifiedItems = githubRes.data.items.slice(0, 5).map((repo) => ({
      id: repo.id,
      full_name: repo.full_name,
      html_url: repo.html_url,
      description: repo.description,
      stargazers_count: repo.stargazers_count,
      language: repo.language,
      owner: { login: repo.owner.login },
    }));

    cache[keyword] = { items: simplifiedItems, fetched_at: new Date() };

    res.json({ message: "Search successful", items: simplifiedItems });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "GitHub API request failed" });
  }
});

app.get("/api/results", (req, res) => {
  const { keyword } = req.query;
  if (!keyword) {
    return res.status(400).json({ error: "Keyword query parameter is required" });
  }

  const result = cache[keyword];
  if (!result) {
    return res.json({ results: [], message: "No results found for this keyword" });
  }

  res.json({ results: result.items });
});

app.get("/api/cache", (req, res) => {
  res.json(cache);
});

app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
