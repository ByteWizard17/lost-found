import { useEffect, useState } from "react";
import { getNotifications, markAsRead, getUnreadCount } from "../services/notificationService";
import "../styles/notificationCenter.css";

function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();

    // Set up Socket.io listener
    const handleNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    // Assuming socket is available globally or through context
    if (window.socket) {
      window.socket.on("notification", handleNewNotification);
      
      return () => {
        window.socket.off("notification", handleNewNotification);
      };
    }
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const data = await getUnreadCount();
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("Failed to load unread count:", error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      setLoading(true);
      await markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
      loadUnreadCount(); // Refresh unread count
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      item_match: "🎉",
      claim_received: "📬",
      claim_accepted: "✅",
      claim_rejected: "❌",
      item_approved: "✅",
      item_rejected: "❌",
      item_pending_approval: "⏳",
    };
    return icons[type] || "📝";
  };

  return (
    <div className="notification-center">
      <button
        className="notification-bell"
        onClick={() => setIsOpen(!isOpen)}
      >
        🔔
        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-panel">
          <h3>Notifications</h3>
          {notifications.length === 0 ? (
            <p className="empty-message">No notifications yet</p>
          ) : (
            <div className="notification-list">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`notification-item ${
                    notification.read ? "read" : "unread"
                  }`}
                  onClick={() => handleMarkAsRead(notification._id)}
                >
                  <span className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </span>
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <small>
                      {new Date(notification.createdAt).toLocaleString()}
                    </small>
                  </div>
                  {!notification.read && (
                    <span className="new-dot"></span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationCenter;
