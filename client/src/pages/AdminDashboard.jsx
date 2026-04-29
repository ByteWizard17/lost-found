import { useCallback, useEffect, useState } from "react";
import { adminService } from "../services/adminService";
import "../styles/adminDashboard.css";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [pendingItems, setPendingItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedItem, setExpandedItem] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingItem, setRejectingItem] = useState(null);
  const [blockReason, setBlockReason] = useState("");
  const [blockingUser, setBlockingUser] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [resolvingReport, setResolvingReport] = useState(null);
  const [notice, setNotice] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const ownerName = (item) => item?.userId?.name || "Deleted user";
  const ownerEmail = (item) => item?.userId?.email || "No email";
  const formatDate = (value) =>
    value ? new Date(value).toLocaleDateString() : "N/A";
  const getErrorMessage = (err, fallback) =>
    err.response?.data?.message || fallback;

  const showNotice = (message, type = "success") => {
    setNotice({ message, type });
  };

  const openConfirm = (config) => {
    setConfirmAction(config);
  };

  const closeConfirm = () => {
    if (confirmLoading) return;
    setConfirmAction(null);
  };

  const handleConfirmAction = async () => {
    if (!confirmAction?.action) return;

    try {
      setConfirmLoading(true);
      await confirmAction.action();
      setConfirmAction(null);
    } finally {
      setConfirmLoading(false);
    }
  };

  const loadData = useCallback(async (tab) => {
    try {
      setLoading(true);
      setError("");

      switch (tab) {
        case "dashboard":
          await loadDashboard();
          break;
        case "pending":
          await loadPendingItems();
          break;
        case "all-posts":
          await loadAllItems();
          break;
        case "users":
          await loadUsers();
          break;
        case "reports":
          await loadReports();
          break;
        default:
          break;
      }
    } catch (err) {
      console.error("Load data error:", err);
      setError(err.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(activeTab);
  }, [activeTab, loadData]);

  const loadDashboard = async () => {
    const [statsData, pending] = await Promise.all([
      adminService.getAdminStats(),
      adminService.getPendingItems(),
    ]);
    setStats(statsData);
    setPendingItems(pending);
  };

  const loadPendingItems = async () => {
    const items = await adminService.getPendingItems();
    setPendingItems(items);
  };

  const loadAllItems = async () => {
    const items = await adminService.getAllItems();
    setAllItems(items);
  };

  const loadUsers = async () => {
    const userData = await adminService.getAllUsers();
    setUsers(userData);
  };

  const loadReports = async () => {
    const reportsData = await adminService.getReports();
    setReports(reportsData);
  };

  const handleApproveItem = async (itemId) => {
    try {
      await adminService.approveItem(itemId);
      showNotice("Item approved.");
      loadData(activeTab);
    } catch (error) {
      showNotice(getErrorMessage(error, "Failed to approve item."), "error");
    }
  };

  const handleRejectItem = async (itemId) => {
    if (!rejectReason.trim()) {
      showNotice("Please provide a rejection reason.", "error");
      return;
    }

    try {
      await adminService.rejectItem(itemId, rejectReason);
      showNotice("Item rejected.");
      setRejectingItem(null);
      setRejectReason("");
      loadData(activeTab);
    } catch (error) {
      showNotice(getErrorMessage(error, "Failed to reject item."), "error");
    }
  };

  const handleDeleteItem = async (itemId) => {
    openConfirm({
      title: "Delete item?",
      message: "This will permanently remove the post from the platform.",
      confirmLabel: "Delete",
      tone: "danger",
      action: async () => {
        try {
          await adminService.deleteItem(itemId, "Removed by admin");
          showNotice("Item deleted successfully.");
          loadData(activeTab);
        } catch (error) {
          showNotice(getErrorMessage(error, "Failed to delete item."), "error");
        }
      },
    });
  };

  const handleBlockUser = async (userId) => {
    if (!blockReason.trim()) {
      showNotice("Please provide a block reason.", "error");
      return;
    }

    try {
      await adminService.blockUser(userId, blockReason);
      showNotice("User blocked successfully.");
      setBlockingUser(null);
      setBlockReason("");
      loadUsers();
    } catch (error) {
      showNotice(getErrorMessage(error, "Failed to block user."), "error");
    }
  };

  const handleUnblockUser = async (userId) => {
    openConfirm({
      title: "Unblock user?",
      message: "This user will regain access to the platform immediately.",
      confirmLabel: "Unblock",
      tone: "primary",
      action: async () => {
        try {
          await adminService.unblockUser(userId);
          showNotice("User unblocked successfully.");
          loadUsers();
        } catch (error) {
          showNotice(getErrorMessage(error, "Failed to unblock user."), "error");
        }
      },
    });
  };

  const handleDeleteUser = async (userId) => {
    openConfirm({
      title: "Delete user?",
      message: "This will remove the user and their posts. This action cannot be undone.",
      confirmLabel: "Delete User",
      tone: "danger",
      action: async () => {
        try {
          await adminService.deleteUser(userId);
          showNotice("User deleted successfully.");
          loadUsers();
        } catch (error) {
          showNotice(getErrorMessage(error, "Failed to delete user."), "error");
        }
      },
    });
  };

  const handleResolveReport = async (reportId, action) => {
    if (action === "deleted" && !deleteReason.trim()) {
      showNotice("Please provide a reason for deletion.", "error");
      return;
    }

    try {
      await adminService.resolveReport(reportId, action, deleteReason);
      showNotice(
        action === "deleted"
          ? "Report resolved and item deleted."
          : "Report dismissed."
      );
      setResolvingReport(null);
      setDeleteReason("");
      loadReports();
    } catch (error) {
      showNotice(getErrorMessage(error, "Failed to resolve report."), "error");
    }
  };

  const renderDashboard = () => (
    <div className="dashboard-view">
      <h2>Dashboard Overview</h2>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">Items</span>
            <div>
              <h4>Total Items</h4>
              <p className="stat-value">{stats.items?.total ?? 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">Lost</span>
            <div>
              <h4>Lost Items</h4>
              <p className="stat-value">{stats.items?.lost ?? 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">Found</span>
            <div>
              <h4>Found Items</h4>
              <p className="stat-value">{stats.items?.found ?? 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">Users</span>
            <div>
              <h4>Total Users</h4>
              <p className="stat-value">{stats.users ?? 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">Pending</span>
            <div>
              <h4>Pending</h4>
              <p className="stat-value">{stats.items?.pending ?? 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">Approved</span>
            <div>
              <h4>Approved</h4>
              <p className="stat-value">{stats.items?.approved ?? 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">Claims</span>
            <div>
              <h4>Total Claims</h4>
              <p className="stat-value">{stats.claims ?? 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">Reports</span>
            <div>
              <h4>Reported Items</h4>
              <p className="stat-value">{stats.items?.reported ?? 0}</p>
            </div>
          </div>
        </div>
      )}

      {pendingItems.length > 0 && (
        <div className="recent-section">
          <h3>Pending Approval ({pendingItems.length})</h3>
          <p className="section-subtitle">Items waiting for admin review</p>
          {pendingItems.slice(0, 3).map((item) => (
            <div key={item._id} className="item-summary">
              <div>
                <h4>{item.title}</h4>
                <p>
                  By: {ownerName(item)} | {new Date(item.date).toLocaleDateString()}
                </p>
              </div>
              <button
                className="btn-small"
                onClick={() => {
                  setActiveTab("pending");
                  setExpandedItem(item._id);
                }}
              >
                Review
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPendingItems = () => (
    <div className="pending-view">
      <h2>Pending Approval ({pendingItems.length})</h2>
      <p className="section-subtitle">Review and approve posts</p>

      {pendingItems.length === 0 ? (
        <div className="empty-state">
          <p>All posts have been reviewed!</p>
        </div>
      ) : (
        <div className="items-list">
          {pendingItems.map((item) => (
            <div key={item._id} className="item-card-expandable">
              <div
                className="item-header"
                onClick={() =>
                  setExpandedItem(expandedItem === item._id ? null : item._id)
                }
              >
                <div className="item-info">
                  <h4>{item.title}</h4>
                  <p className="item-meta">
                    By: {ownerName(item)} ({ownerEmail(item)})
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
                      <strong>Type:</strong> {item.type === "lost" ? "Lost" : "Found"}
                    </p>
                    <p>
                      <strong>Category:</strong> {item.category || "N/A"}
                    </p>
                    <p>
                      <strong>Location:</strong> {item.location || "N/A"}
                    </p>
                    <p>
                      <strong>Posted:</strong> {new Date(item.date).toLocaleDateString()}
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

                  <div className="item-actions">
                    <button
                      className="btn-approve"
                      onClick={() => handleApproveItem(item._id)}
                    >
                      Approve
                    </button>

                    {rejectingItem === item._id ? (
                      <div className="reject-form">
                        <textarea
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Enter rejection reason..."
                          rows="2"
                        />
                        <div className="reject-buttons">
                          <button
                            className="btn-reject-confirm"
                            onClick={() => handleRejectItem(item._id)}
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
                        Reject
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
  );

  const renderAllPosts = () => (
    <div className="all-posts-view">
      <h2>Manage All Posts ({allItems.length})</h2>
      <p className="section-subtitle">View full uploaded post details and delete any post</p>

      {allItems.length === 0 ? (
        <div className="empty-state">
          <p>No posts found</p>
        </div>
      ) : (
        <div className="items-list">
          {allItems.map((item) => (
            <div key={item._id} className="item-card">
              {item.image && (
                <img src={item.image} alt={item.title} className="item-thumb" />
              )}
              <div className="item-content">
                <div>
                  <h4>{item.title}</h4>
                  <p className="item-meta">
                    {item.type === "lost" ? "Lost" : "Found"} | By: {ownerName(item)}
                  </p>
                  <p className="item-meta">
                    {item.category || "Uncategorized"} • {item.location || "Unknown"}
                  </p>
                  <p className="item-meta">
                    Uploaded by: {ownerEmail(item)}
                  </p>
                  <p className="item-meta">
                    Phone: {item.phone || item?.userId?.phone || "N/A"} | Color: {item.color || "N/A"}
                  </p>
                  <p className="item-meta">
                    Posted: {formatDate(item.date)} | Lost: {formatDate(item.dateLost)} | Found: {formatDate(item.dateFound)}
                  </p>
                  <p className="item-meta">
                    Reward: {item.reward || "N/A"} | Condition: {item.condition || "N/A"} | Collected: {item.collected ? "Yes" : "No"}
                  </p>
                  <p className="item-meta item-description-preview">
                    {item.description}
                  </p>
                  <p
                    className="status-badge"
                    style={{
                      backgroundColor:
                        item.status === "approved"
                          ? "#4caf50"
                          : item.status === "pending"
                            ? "#ff9800"
                            : "#f44336",
                    }}
                  >
                    {item.status}
                  </p>
                </div>
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteItem(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderUsers = () => (
    <div className="users-view">
      <h2>Manage Users ({users.length})</h2>
      <p className="section-subtitle">Block or delete users</p>

      {users.length === 0 ? (
        <div className="empty-state">
          <p>No users found</p>
        </div>
      ) : (
        <div className="users-list">
          {users.map((user) => (
            <div key={user._id} className="user-card">
              <div className="user-info">
                <h4>{user.name}</h4>
                <p className="user-email">{user.email}</p>
                <p className="user-meta">
                  Role: <strong>{user.role}</strong> | Joined:{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
                {user.isBlocked && (
                  <p className="blocked-badge">BLOCKED - {user.blockedReason}</p>
                )}
              </div>
              <div className="user-actions">
                {user.isBlocked ? (
                  <button
                    className="btn-unblock"
                    onClick={() => handleUnblockUser(user._id)}
                  >
                    Unblock
                  </button>
                ) : (
                  <>
                    {blockingUser === user._id ? (
                      <div className="block-form">
                        <textarea
                          value={blockReason}
                          onChange={(e) => setBlockReason(e.target.value)}
                          placeholder="Reason for blocking..."
                          rows="2"
                        />
                        <button
                          className="btn-small-confirm"
                          onClick={() => handleBlockUser(user._id)}
                        >
                          Block
                        </button>
                        <button
                          className="btn-small-cancel"
                          onClick={() => {
                            setBlockingUser(null);
                            setBlockReason("");
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          className="btn-block"
                          onClick={() => setBlockingUser(user._id)}
                        >
                          Block
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderReports = () => (
    <div className="reports-view">
      <h2>Community Reports ({reports.length})</h2>
      <p className="section-subtitle">Review and resolve user-submitted reports</p>

      {reports.length === 0 ? (
        <div className="empty-state">
          <p>No reports yet. Great community!</p>
        </div>
      ) : (
        <div className="reports-list">
          {reports.map((report) => (
            <div key={report._id} className="report-card">
              <div className="report-header">
                <div>
                  <h4>{report.itemId?.title || "Deleted Item"}</h4>
                  <p className="report-meta">
                    Reported by: {report.reportedBy?.name || "Unknown"}
                  </p>
                  <p className="report-meta">
                    Reason: <strong>{report.reason}</strong>
                  </p>
                </div>
                <span
                  className="status-badge"
                  style={{
                    backgroundColor: report.status === "pending" ? "#ff9800" : "#4caf50",
                  }}
                >
                  {report.status}
                </span>
              </div>

              <p className="report-description">
                <strong>Details:</strong> {report.description}
              </p>

              {report.status === "pending" && (
                <div className="report-actions">
                  {resolvingReport === report._id ? (
                    <div className="resolve-form">
                      <textarea
                        value={deleteReason}
                        onChange={(e) => setDeleteReason(e.target.value)}
                        placeholder="Reason for deletion (if deleting)..."
                        rows="2"
                      />
                      <div className="resolve-buttons">
                        <button
                          className="btn-delete-post"
                          onClick={() => handleResolveReport(report._id, "deleted")}
                        >
                          Delete Post
                        </button>
                        <button
                          className="btn-dismiss"
                          onClick={() => handleResolveReport(report._id, "dismissed")}
                        >
                          Dismiss Report
                        </button>
                        <button
                          className="btn-cancel"
                          onClick={() => {
                            setResolvingReport(null);
                            setDeleteReason("");
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="btn-review"
                      onClick={() => setResolvingReport(report._id)}
                    >
                      Review & Resolve
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (
    loading &&
    !stats &&
    !pendingItems.length &&
    !allItems.length &&
    !users.length &&
    !reports.length
  ) {
    return <div className="loading">Loading admin dashboard...</div>;
  }

  return (
    <div className="admin-dashboard-container">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Manage posts, users, reports, and keep the platform clean</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {notice && (
        <div className={`admin-notice admin-notice-${notice.type}`}>
          <span>{notice.message}</span>
          <button type="button" onClick={() => setNotice(null)}>
            Close
          </button>
        </div>
      )}

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`tab-btn ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending
        </button>
        <button
          className={`tab-btn ${activeTab === "all-posts" ? "active" : ""}`}
          onClick={() => setActiveTab("all-posts")}
        >
          All Posts
        </button>
        <button
          className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button
          className={`tab-btn ${activeTab === "reports" ? "active" : ""}`}
          onClick={() => setActiveTab("reports")}
        >
          Reports
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "pending" && renderPendingItems()}
        {activeTab === "all-posts" && renderAllPosts()}
        {activeTab === "users" && renderUsers()}
        {activeTab === "reports" && renderReports()}
      </div>

      {confirmAction && (
        <div className="admin-modal-backdrop" onClick={closeConfirm}>
          <div
            className="admin-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <h3>{confirmAction.title}</h3>
            <p>{confirmAction.message}</p>
            <div className="admin-modal-actions">
              <button
                type="button"
                className={`btn-small ${confirmAction.tone === "danger" ? "btn-modal-danger" : ""}`}
                onClick={handleConfirmAction}
                disabled={confirmLoading}
              >
                {confirmLoading ? "Working..." : confirmAction.confirmLabel}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={closeConfirm}
                disabled={confirmLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
