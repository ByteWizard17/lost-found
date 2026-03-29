import { useState } from "react";

function SearchBar({ onSearch }) {

  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div style={{marginBottom:"20px"}}>

      <input
        type="text"
        placeholder="Search by item name or location..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button onClick={handleSearch}>
        Search
      </button>

    </div>
  );
}

export default SearchBar;