import { useEffect, useState } from "react";
import {
  getPendingItems,
  approveItem,
  rejectItem,
  getAdminStats,
} from "../services/itemService";
import "../styles/adminDashboard.css";

function AdminDashboard() {
  const [pendingItems, setPendingItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedItem, setExpandedItem] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingItem, setRejectingItem] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [items, statsData] = await Promise.all([
        getPendingItems(),
        getAdminStats(),
      ]);
      setPendingItems(items);
      setStats(statsData);
    } catch (err) {
      console.error("Load dashboard error:", err);
      setError("Failed to load admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (itemId) => {
    try {
      await approveItem(itemId);
      alert("✅ Item approved!");
      loadDashboard();
    } catch (error) {
      console.error("Approve error:", error);
      alert("❌ Failed to approve item");
    }
  };

  const handleReject = async (itemId) => {
    if (!rejectReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    try {
      await rejectItem(itemId, rejectReason);
      alert("❌ Item rejected");
      setRejectingItem(null);
      setRejectReason("");
      loadDashboard();
    } catch (error) {
      console.error("Reject error:", error);
      alert("❌ Failed to reject item");
    }
  };

  if (loading) return <div className="loading">Loading admin dashboard...</div>;

  return (
    <div className="admin-dashboard-container">
      <div className="page-header">
        <h2>👑 Admin Dashboard</h2>
        <p>Manage posts, review statistics, and keep the platform clean</p>
      </div>

      {error && <div className="error-message">❌ {error}</div>}

      {/* Statistics Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">📦</span>
            <div>
              <h4>Total Items</h4>
              <p className="stat-value">{stats.items.total}</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">✅</span>
            <div>
              <h4>Approved</h4>
              <p className="stat-value">{stats.items.approved}</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">⏳</span>
            <div>
              <h4>Pending</h4>
              <p className="stat-value">{stats.items.pending}</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🔴</span>
            <div>
              <h4>Lost Items</h4>
              <p className="stat-value">{stats.items.lost}</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🟢</span>
            <div>
              <h4>Found Items</h4>
              <p className="stat-value">{stats.items.found}</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">👥</span>
            <div>
              <h4>Total Users</h4>
              <p className="stat-value">{stats.users}</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">💬</span>
            <div>
              <h4>Total Claims</h4>
              <p className="stat-value">{stats.claims}</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">⚠️</span>
            <div>
              <h4>Reported</h4>
              <p className="stat-value">{stats.items.reported}</p>
            </div>
          </div>
        </div>
      )}

      {/* Pending Items Section */}
      <div className="pending-section">
        <h3>⏳ Pending Approval ({pendingItems.length})</h3>

        {pendingItems.length === 0 ? (
          <div className="empty-state">
            <p>✅ All posts have been reviewed!</p>
          </div>
        ) : (
          <div className="pending-items-list">
            {pendingItems.map((item) => (
              <div key={item._id} className="pending-item-card">
                <div
                  className="item-header"
                  onClick={() =>
                    setExpandedItem(
                      expandedItem === item._id ? null : item._id
                    )
                  }
                >
                  <div className="item-info">
                    <h4>{item.title}</h4>
                    <p className="item-meta">
                      By: {item.userId.name} ({item.userId.email})
                    </p>
                  </div>
                  <span className="expand-icon">
                    {expandedItem === item._id ? "▼" : "▶"}
                  </span>
                </div>

                {expandedItem === item._id && (
                  <div className="item-details">
                    <div className="detail-grid">
                      <p>
                        <strong>Type:</strong>{" "}
                        {item.type === "lost" ? "🔴 Lost" : "🟢 Found"}
                      </p>
                      <p>
                        <strong>Category:</strong> {item.category}
                      </p>
                      <p>
                        <strong>Location:</strong> {item.location}
                      </p>
                      <p>
                        <strong>Date Posted:</strong>{" "}
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>

                    <p>
                      <strong>Description:</strong>
                    </p>
                    <p className="description">{item.description}</p>

                    {item.image && (
                      <div className="item-image-container">
                        <img src={item.image} alt={item.title} />
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="item-actions">
                      <button
                        className="btn-approve"
                        onClick={() => handleApprove(item._id)}
                      >
                        ✅ Approve Post
                      </button>

                      {rejectingItem === item._id ? (
                        <div className="reject-form">
                          <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Enter rejection reason..."
                            rows="3"
                          />
                          <div className="reject-buttons">
                            <button
                              className="btn-reject-confirm"
                              onClick={() => handleReject(item._id)}
                            >
                              Send Rejection
                            </button>
                            <button
                              className="btn-cancel"
                              onClick={() => {
                                setRejectingItem(null);
                                setRejectReason("");
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          className="btn-reject"
                          onClick={() => setRejectingItem(item._id)}
                        >
                          ❌ Reject Post
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
