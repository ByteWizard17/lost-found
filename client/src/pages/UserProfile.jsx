import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserProfile, updateProfile } from "../services/userService";
import "../styles/userProfile.css";

function UserProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [postedItems, setPostedItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile(userId);
      setUser(data.user);
      setPostedItems(data.postedItems);
      setFormData(data.user);
    } catch (err) {
      console.error("Load profile error:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveProfile = async () => {
    try {
      const updated = await updateProfile(formData);
      setUser(updated);
      setIsEditing(false);
      alert("✅ Profile updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      alert("❌ Failed to update profile");
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (!user) {
    return <div className="error">{error || "Profile not found"}</div>;
  }

  return (
    <div className="user-profile-container">
      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-image">
            {user.profileImage ? (
              <img src={user.profileImage} alt={user.name} />
            ) : (
              <div className="default-avatar">👤</div>
            )}
          </div>

          <div className="profile-info">
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  className="edit-input"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="edit-input"
                  disabled
                />
              </>
            ) : (
              <>
                <h2>{user.name}</h2>
                <p className="email">{user.email}</p>
              </>
            )}
          </div>

          <div className="role-badge">{user.role === "admin" ? "👑 Admin" : "👤 User"}</div>
        </div>

        {/* Contact Info */}
        <div className="contact-section">
          <h3>📞 Contact Information</h3>
          {isEditing ? (
            <>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ""}
                onChange={handleInputChange}
                placeholder="Phone"
                className="edit-input"
              />
              <input
                type="text"
                name="city"
                value={formData.city || ""}
                onChange={handleInputChange}
                placeholder="City"
                className="edit-input"
              />
            </>
          ) : (
            <>
              <p>📱 Phone: {user.phone || "Not provided"}</p>
              <p>🏙️ City: {user.city || "Not provided"}</p>
            </>
          )}
        </div>

        {/* Bio */}
        <div className="bio-section">
          <h3>📝 Bio</h3>
          {isEditing ? (
            <textarea
              name="bio"
              value={formData.bio || ""}
              onChange={handleInputChange}
              placeholder="Tell us about yourself..."
              className="edit-textarea"
              rows="4"
            />
          ) : (
            <p>{user.bio || "No bio added yet"}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="profile-actions">
          {isEditing ? (
            <>
              <button className="btn-save" onClick={handleSaveProfile}>
                ✅ Save Changes
              </button>
              <button className="btn-cancel" onClick={() => setIsEditing(false)}>
                ❌ Cancel
              </button>
            </>
          ) : (
            <button className="btn-edit" onClick={() => setIsEditing(true)}>
              ✏️ Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="profile-stats">
        <div className="stat-card">
          <span className="stat-label">📦 Items Posted</span>
          <span className="stat-value">{postedItems.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">🟢 Total User Lifetime</span>
          <span className="stat-value">
            {new Date(user.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Posted Items */}
      <div className="posted-items-section">
        <h3>📋 My Posted Items</h3>
        {postedItems.length === 0 ? (
          <p className="empty-message">No items posted yet</p>
        ) : (
          <div className="items-grid">
            {postedItems.map((item) => (
              <div key={item._id} className="item-card">
                <h4>{item.title}</h4>
                <p>
                  <strong>Category:</strong> {item.category}
                </p>
                <p>
                  <strong>Type:</strong>{" "}
                  {item.type === "lost" ? "🔴 Lost" : "🟢 Found"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`status-badge ${item.status}`}
                  >
                    {item.status}
                  </span>
                </p>
                <p className="date">{new Date(item.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
