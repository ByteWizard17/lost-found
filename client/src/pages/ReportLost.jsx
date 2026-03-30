import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ReportLost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [dateLost, setDateLost] = useState("");
  const [color, setColor] = useState("");
  const [reward, setReward] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const getGpsLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setError("");
        setLocation(`${pos.coords.latitude}, ${pos.coords.longitude}`);
      },
      (err) => {
        setError("Could not get GPS location. Please allow location access.");
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!description.trim()) {
      setError("Description is required");
      return;
    }
    if (!location.trim()) {
      setError("Location is required");
      return;
    }
    if (!category) {
      setError("Please select a category");
      return;
    }
    if (!dateLost) {
      setError("Date lost is required");
      return;
    }
    if (!phone.trim() && !email.trim()) {
      setError("Please provide either phone or email");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("category", category);
    formData.append("dateLost", dateLost);
    formData.append("color", color);
    formData.append("reward", reward);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("type", "lost");
    if (image) formData.append("image", image);

    try {
      const res = await api.post("/items", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      if (res.status !== 200) {
        setError("Failed to submit item. Please try again.");
        return;
      }

      setSuccess("✅ Item reported successfully! We'll help you find it.");
      setTimeout(() => {
        setTitle("");
        setDescription("");
        setLocation("");
        setCategory("");
        setDateLost("");
        setColor("");
        setReward("");
        setPhone("");
        setEmail("");
        setImage(null);
        setSuccess("");
      }, 2000);
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.response?.data?.message || err.message || "Failed to submit item. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="card report-card">
        <h2>📋 Report Lost Item</h2>
        <p className="card-subtitle">Help us find your lost item. The more details you provide, the better!</p>

        {success && <p className="success-message">{success}</p>}
        {error && <p className="error-message">❌ {error}</p>}

        <form onSubmit={handleSubmit} className="report-form">
          {/* Row 1 */}
          <div className="form-row">
            <div className="form-group">
              <label>Item Title *</label>
              <input 
                value={title} 
                onChange={(e) => setTitle(e.target.value.slice(0, 50))}
                maxLength="50"
                placeholder="e.g., Black iPhone 13" 
              />
              <small>{title.length}/50</small>
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select a category</option>
                <option value="phone">📱 Phone</option>
                <option value="wallet">💼 Wallet</option>
                <option value="keys">🔑 Keys</option>
                <option value="bag">🎒 Bag</option>
                <option value="watch">⌚ Watch</option>
                <option value="glasses">👓 Glasses</option>
                <option value="jewelry">💎 Jewelry</option>
                <option value="document">📄 Document</option>
                <option value="other">📦 Other</option>
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="form-row">
            <div className="form-group">
              <label>Date Lost *</label>
              <input 
                type="date"
                value={dateLost}
                onChange={(e) => setDateLost(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Color/Appearance</label>
              <input 
                value={color}
                onChange={(e) => setColor(e.target.value.slice(0, 30))}
                maxLength="30"
                placeholder="e.g., Black and silver" 
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="form-group">
            <label>Description *</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value.slice(0, 300))}
              maxLength="300"
              placeholder="Describe your item in detail..." 
              rows="4"
            />
            <small>{description.length}/300</small>
          </div>

          {/* Row 4 */}
          <div className="form-row">
            <div className="form-group">
              <label>Location Lost *</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Library Floor 2" 
                />
                <button type="button" className="gps-btn" onClick={getGpsLocation}>📍 GPS</button>
              </div>
            </div>
          </div>

          {/* Row 5 */}
          <div className="form-row">
            <div className="form-group">
              <label>Reward Amount (Optional)</label>
              <input 
                type="number"
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                placeholder="e.g., 500" 
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g., +92 300 1234567" 
              />
            </div>
          </div>

          {/* Row 6 */}
          <div className="form-group">
            <label>Email *</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com" 
            />
          </div>

          {/* Row 7 */}
          <div className="form-group">
            <label>Attach Photo (Optional)</label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => setImage(e.target.files[0])}
              className="file-input"
            />
            {image && <small className="file-name">✓ {image.name}</small>}
          </div>

          <div className="form-buttons">
            <button type="button" className="back-btn" onClick={() => navigate("/")}> ← Back to Home</button>
            <button type="submit" className="submit-btn">Submit Report</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReportLost;