import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container">

      <section className="hero">

        <h1>🎒 Lost & Found Portal</h1>

        <p>
          A platform where students can report lost items and help others
          recover them easily.
        </p>

        <div className="home-buttons">

          <Link to="/report-lost">
            <button className="btn lost-btn">Report Lost</button>
          </Link>

          <Link to="/report-found">
            <button className="btn found-btn">Report Found</button>
          </Link>

          <Link to="/dashboard">
            <button className="btn dashboard-btn">View Dashboard</button>
          </Link>

        </div>

      </section>

      <section className="features">

        <h2>Platform Features</h2>

        <div className="feature-grid">

          <div className="feature-card">
            <h3>🔍 Search Items</h3>
            <p>Quickly search lost and found items.</p>
          </div>

          <div className="feature-card">
            <h3>📦 Report Items</h3>
            <p>Report items you have lost or found.</p>
          </div>

          <div className="feature-card">
            <h3>📊 Dashboard</h3>
            <p>View all reported items in one place.</p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;