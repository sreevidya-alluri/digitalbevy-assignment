import { useEffect, useState } from "react";
import SearchForm from "./components/SearchForm";
import ResultsDashboard from "./components/ResultsDashboard";
import "./App.css";

export default function App() {
  const [results, setResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [currentKeyword, setCurrentKeyword] = useState("");

  
  const fetchResults = async (pageNum = 1, keyword) => {
    console.log(`Fetching results for keyword="${keyword}" page=${pageNum}`);
    setDashboardLoading(true);
    setDashboardError("");
    try {
      if (!keyword) throw new Error("Keyword is required to fetch results");

      const res = await fetch(`/api/results?keyword=${encodeURIComponent(keyword)}&page=${pageNum}`);
      if (!res.ok) {
        console.error("Failed to fetch results:", res.status, res.statusText);
        throw new Error(`Error: ${res.statusText}`);
      }
      const data = await res.json();
      console.log("Fetched results data:", data);
      setResults(data.results);
      setPages(data.totalPages || 1);
      setPage(pageNum);
    } catch (err) {
      console.error("Error in fetchResults:", err);
      setDashboardError(err.message || "Failed to fetch results.");
    }
    setDashboardLoading(false);
  };

  useEffect(() => {
    if (currentKeyword) {
      fetchResults(1, currentKeyword);
    }
  }, [currentKeyword]);

  
  const handleSearch = async (keyword) => {
    console.log("Starting search for:", keyword);
    setSearchError("");
    setSearchLoading(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });
      if (!res.ok) {
        console.error("Search POST failed:", res.status, res.statusText);
        throw new Error("Failed to search.");
      }
      const json = await res.json();
      console.log("Search POST response:", json);

      setCurrentKeyword(keyword);  
    } catch (e) {
      console.error("Error in handleSearch:", e);
      setSearchError(e.message);
    }
    setSearchLoading(false);
  };


  const handlePageChange = (num) => {
    console.log("Change page to:", num);
    if (num !== page && num > 0 && num <= pages) {
      fetchResults(num, currentKeyword);
    }
  };

  return (
    <div className="App">
      <h1>Repo Search Dashboard</h1>
      <SearchForm onSearch={handleSearch} loading={searchLoading} />
      {searchError && <p className="error">{searchError}</p>}
      <ResultsDashboard
        results={results}
        page={page}
        pages={pages}
        loading={dashboardLoading}
        error={dashboardError}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
