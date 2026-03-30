import { useEffect, useState } from "react";
import { getMyItems, approveClaim, rejectClaim } from "../services/itemService";
import "../styles/myItems.css";

function MyItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedItem, setExpandedItem] = useState(null);

  useEffect(() => {
    loadMyItems();
  }, []);

  const loadMyItems = async () => {
    try {
      setLoading(true);
      const data = await getMyItems();
      setItems(data);
    } catch (err) {
      console.error("Load items error:", err);
      setError("Failed to load your items");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveClaim = async (itemId, claimIndex) => {
    try {
      await approveClaim(itemId, claimIndex);
      alert("✅ Claim approved!");
      loadMyItems();
    } catch (error) {
      console.error("Approve error:", error);
      alert("❌ Failed to approve claim");
    }
  };

  const handleRejectClaim = async (itemId, claimIndex) => {
    try {
      await rejectClaim(itemId, claimIndex);
      alert("❌ Claim rejected");
      loadMyItems();
    } catch (error) {
      console.error("Reject error:", error);
      alert("❌ Failed to reject claim");
    }
  };

  if (loading) return <div className="loading">Loading your items...</div>;

  return (
    <div className="my-items-container">
      <div className="page-header">
        <h2>📦 My Posted Items</h2>
        <p>Manage your lost & found items and review claims</p>
      </div>

      {error && <div className="error-message">❌ {error}</div>}

      {items.length === 0 ? (
        <div className="empty-state">
          <p>You haven't posted any items yet</p>
        </div>
      ) : (
        <div className="items-list">
          {items.map((item) => (
            <div key={item._id} className="item-section">
              <div className="item-header" onClick={() => setExpandedItem(expandedItem === item._id ? null : item._id)}>
                <div className="item-title-section">
                  <h3>{item.title}</h3>
                  <span className={`type-badge ${item.type}`}>
                    {item.type === "lost" ? "🔴 Lost" : "🟢 Found"}
                  </span>
                  <span className={`status-badge ${item.status}`}>
                    {item.status}
                  </span>
                </div>
                <span className="expand-icon">
                  {expandedItem === item._id ? "▼" : "▶"}
                </span>
              </div>

              {expandedItem === item._id && (
                <div className="item-details">
                  <p>
                    <strong>Category:</strong> {item.category}
                  </p>
                  <p>
                    <strong>Location:</strong> {item.location}
                  </p>
                  <p>
                    <strong>Description:</strong> {item.description}
                  </p>
                  {item.image && (
                    <img src={item.image} alt={item.title} className="item-image" />
                  )}

                  {/* Claims Section */}
                  {item.claims && item.claims.length > 0 && (
                    <div className="claims-section">
                      <h4>💬 Claims ({item.claims.length})</h4>
                      {item.claims.map((claim, index) => (
                        <div key={index} className={`claim-card ${claim.status}`}>
                          <div className="claim-info">
                            <p>
                              <strong>User:</strong>{" "}
                              {claim.userId.name || "Unknown"}
                            </p>
                            <p>
                              <strong>Contact:</strong>{" "}
                              {claim.userId.email}
                            </p>
                            <p>
                              <strong>Message:</strong> {claim.message}
                            </p>
                            <p className="claim-date">
                              {new Date(claim.claimDate).toLocaleString()}
                            </p>
                            <p className="claim-status">
                              <strong>Status:</strong>{" "}
                              <span className={`status ${claim.status}`}>
                                {claim.status}
                              </span>
                            </p>
                          </div>

                          {claim.status === "pending" && (
                            <div className="claim-actions">
                              <button
                                className="btn-approve"
                                onClick={() => handleApproveClaim(item._id, index)}
                              >
                                ✅ Approve
                              </button>
                              <button
                                className="btn-reject"
                                onClick={() => handleRejectClaim(item._id, index)}
                              >
                                ❌ Reject
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {!item.claims || item.claims.length === 0 && (
                    <p className="no-claims">No claims yet</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyItems;
