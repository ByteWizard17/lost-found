import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const loadItems = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/items?uncollected=true");
      if (!res.ok) throw new Error("Failed to load items");
      const data = await res.json();
      setItems(data || []);
      setError("");
    } catch (err) {
      console.error("Error:", err);
      setError("Could not load dashboard items. Please refresh.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const markCollected = async (id) => {
    try {
      const res = await fetch(`/api/items/${id}/collected`, { method: "PATCH" });
      if (!res.ok) throw new Error("Could not mark collected");
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
      setError("Could not mark item as collected. Try again.");
    }
  };

  // Filter and search logic
  const filteredItems = items
    .filter((item) => filter === "all" || item.type === filter)
    .filter((item) =>
      search === "" ||
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase()) ||
      item.location?.toLowerCase().includes(search.toLowerCase())
    );

  const lostCount = items.filter((i) => i.type === "lost").length;
  const foundCount = items.filter((i) => i.type === "found").length;

  return (
    <div className="container">
      <div className="dashboard-header">
        <div>
          <h2>📊 Dashboard</h2>
          <p>View all reported lost and found items</p>
        </div>
        <div className="dashboard-stats">
          <div className="stat-card">
            <span className="stat-label">🔴 Lost Items</span>
            <span className="stat-number">{lostCount}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">🟢 Found Items</span>
            <span className="stat-number">{foundCount}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">📦 Total</span>
            <span className="stat-number">{items.length}</span>
          </div>
        </div>
      </div>

      {error && <p className="error-message">❌ {error}</p>}

      <div className="dashboard-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All Items
          </button>
          <button
            className={`filter-btn ${filter === "lost" ? "active" : ""}`}
            onClick={() => setFilter("lost")}
          >
            🔴 Lost
          </button>
          <button
            className={`filter-btn ${filter === "found" ? "active" : ""}`}
            onClick={() => setFilter("found")}
          >
            🟢 Found
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading items...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No items found</h3>
          <p>
            {search ? "Try searching with different keywords" : "Be the first to report an item!"}
          </p>
          <div className="empty-state-buttons">
            <button className="action-btn" onClick={() => navigate("/report-lost")}>
              🔴 Report Lost Item
            </button>
            <button className="action-btn action-btn-found" onClick={() => navigate("/report-found")}>
              🟢 Report Found Item
            </button>
          </div>
        </div>
      ) : (
        <div className="items-grid">
          {filteredItems.map((item) => (
            <div className="dashboard-item-card" key={item._id}>
              <div className="item-header">
                <h3>{item.title || "Untitled"}</h3>
                <span className={`item-badge ${item.type}`}>
                  {item.type === "lost" ? "🔴 Lost" : "🟢 Found"}
                </span>
              </div>

              {item.image && (
                <div className="item-image">
                  <img src={item.image} alt={item.title} />
                </div>
              )}

              <div className="item-details">
                <div className="detail-row">
                  <span className="label">📝 Description:</span>
                  <span className="value">{item.description}</span>
                </div>

                <div className="detail-row">
                  <span className="label">📍 Location:</span>
                  <span className="value">{item.location}</span>
                </div>

                {item.category && (
                  <div className="detail-row">
                    <span className="label">📂 Category:</span>
                    <span className="value">{item.category}</span>
                  </div>
                )}

                {item.color && (
                  <div className="detail-row">
                    <span className="label">🎨 Color:</span>
                    <span className="value">{item.color}</span>
                  </div>
                )}

                {item.phone && (
                  <div className="detail-row">
                    <span className="label">📱 Phone:</span>
                    <span className="value">{item.phone}</span>
                  </div>
                )}

                {item.email && (
                  <div className="detail-row">
                    <span className="label">📧 Email:</span>
                    <span className="value">{item.email}</span>
                  </div>
                )}

                {item.reward && (
                  <div className="detail-row reward">
                    <span className="label">💰 Reward:</span>
                    <span className="value">PKR {item.reward}</span>
                  </div>
                )}

                <div className="detail-row">
                  <span className="label">📅 Date:</span>
                  <span className="value">
                    {item.date ? new Date(item.date).toLocaleDateString() : "Not available"}
                  </span>
                </div>
              </div>

              <button
                className="mark-collected-btn"
                onClick={() => markCollected(item._id)}
              >
                ✅ Mark as Collected
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;