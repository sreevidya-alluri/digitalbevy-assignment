const axios = require("axios");
const express = require("express");
const app = express();
app.use(express.json());

const GITHUB_API_URL = "https://api.github.com/search/repositories";

// In-memory cache
const cache = {};

// Search GitHub and cache results
async function searchRepos(req, res) {
  try {
    const { keyword } = req.body;
    if (!keyword) return res.status(400).json({ error: "Keyword required" });

    // If cached, return from memory
    if (cache[keyword]) {
      return res.json({ message: "From cache", items: cache[keyword].items });
    }

    // Otherwise, fetch from GitHub
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

    // Store in cache
    cache[keyword] = { items: simplifiedItems, fetched_at: new Date() };

    res.json({ message: "Search successful", items: simplifiedItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "GitHub API request failed" });
  }
}

// Get results for a keyword
function getResults(req, res) {
  const { keyword } = req.query;
  if (!keyword) return res.status(400).json({ error: "Keyword query parameter is required" });

  const result = cache[keyword];
  if (!result) return res.json({ results: [], message: "No results found for this keyword" });

  res.json({ results: result.items });
}

// 🔥 New endpoint: expose the entire cache
function getCache(req, res) {
  res.json(cache);
}

// Routes
app.post("/search", searchRepos);
app.get("/results", getResults);
app.get("/cache", getCache); // 👈 now you can see cache

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
