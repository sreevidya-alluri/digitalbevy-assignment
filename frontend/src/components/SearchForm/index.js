import { useState } from "react";

export default function SearchForm({ onSearch, loading }) {
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) onSearch(keyword);
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter keyword (e.g. react)"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        disabled={loading}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}
