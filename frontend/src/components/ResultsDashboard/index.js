import { useState, useEffect } from "react";

export default function ResultsDashboard({ results, loading, error }) {
  const itemsPerPage = 3;  
  const [currentPage, setCurrentPage] = useState(1);

  const pages = Math.ceil(results.length / itemsPerPage);
  const currentResults = results.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1); 
  }, [results]);

  return (
    <div className="dashboard">
      <h2>Stored Results</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && currentResults.length === 0 && <p>No results found.</p>}

      <ul>
        {currentResults.map((repo) => (
          <li key={repo.id}>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
              {repo.full_name}
            </a>
            <small> ★ {repo.stargazers_count}</small>
            <p>{repo.description}</p>
          </li>
        ))}
      </ul>

      {pages > 1 && (
        <div className="pagination" style={{ display: "flex", gap: "8px", marginTop: "15px" }}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {[...Array(pages)].map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                style={{
                  fontWeight: currentPage === pageNum ? "bold" : "normal",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  backgroundColor: currentPage === pageNum ? "#007bff" : "white",
                  color: currentPage === pageNum ? "white" : "black",
                  cursor: "pointer",
                }}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, pages))}
            disabled={currentPage === pages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
