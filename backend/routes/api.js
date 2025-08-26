const express = require("express");
const router = express.Router();
const { searchRepos, getResults } = require("../controllers/githubController.js");

router.post("/search", searchRepos);
router.get("/results", getResults);

module.exports = router;
