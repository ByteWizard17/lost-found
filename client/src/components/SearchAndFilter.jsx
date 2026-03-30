import { useState } from "react";
import { searchItems } from "../services/itemService";
import "../styles/searchAndFilter.css";

function SearchAndFilter({ onSearchResults }) {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const results = await searchItems(keyword, category, type, dateFrom, dateTo);
      onSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      alert("Failed to search items");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setKeyword("");
    setCategory("");
    setType("");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="search-filter-container">
      <h3>🔍 Search & Filter Items</h3>
      <form onSubmit={handleSearch} className="search-form">
        {/* Keyword */}
        <div className="form-group">
          <label>Keywords</label>
          <input
            type="text"
            placeholder="Search by title, description, location..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        {/* Category */}
        <div className="form-group">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Jewelry">Jewelry</option>
            <option value="Clothing">Clothing</option>
            <option value="Documents">Documents</option>
            <option value="Pets">Pets</option>
            <option value="Keys">Keys</option>
            <option value="Wallet">Wallet</option>
            <option value="Phone">Phone</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Type */}
        <div className="form-group">
          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All Types</option>
            <option value="lost">🔴 Lost</option>
            <option value="found">🟢 Found</option>
          </select>
        </div>

        {/* Date Range */}
        <div className="form-group">
          <label>From Date</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>To Date</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="button-group">
          <button type="submit" className="btn-search" disabled={loading}>
            {loading ? "Searching..." : "🔍 Search"}
          </button>
          <button type="button" className="btn-clear" onClick={handleClear}>
            Clear Filters
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchAndFilter;
