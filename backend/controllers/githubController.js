const axios = require("axios");
const Result = require("../models/Result");

const GITHUB_API_URL = "https://api.github.com/search/repositories";


async function searchRepos(req, res) {
  try {
    const { keyword } = req.body;
    if (!keyword) return res.status(400).json({ error: "Keyword required" });

    
    const githubRes = await axios.get(
      `${GITHUB_API_URL}?q=${encodeURIComponent(keyword)}&per_page=5`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        
        }
      }
    );

   
    const simplifiedItems = githubRes.data.items.slice(0, 5).map(repo => ({
      id: repo.id,
      full_name: repo.full_name,
      html_url: repo.html_url,
      description: repo.description,
      stargazers_count: repo.stargazers_count,
      language: repo.language,
      owner: {
        login: repo.owner.login,
       
      },
    }));


    await Result.destroy({ where: { keyword } });


    await Result.create({
      keyword,
      items: simplifiedItems,
      fetched_at: new Date(),
    });

    res.json({ message: "Search successful", items: simplifiedItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "GitHub API request failed" });
  }
}


async function getResults(req, res) {
  try {
    const { keyword } = req.query;
    if (!keyword) return res.status(400).json({ error: "Keyword query parameter is required" });

    const result = await Result.findOne({ where: { keyword } });
    if (!result) return res.json({ results: [], message: "No results found for this keyword" });

    res.json({ results: result.items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch stored results" });
  }
}

module.exports = { searchRepos, getResults };
