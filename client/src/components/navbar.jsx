import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <h2>Lost & Found</h2>
      </Link>

      <div className="nav-links">
        {user ? (
          <>
            {isAdmin && (
              <Link to="/admin" className="nav-link admin-link">
                Admin Dashboard
              </Link>
            )}
            <span className="user-name">{user.name || "User"}</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/admin-login" className="nav-link admin-link">Admin Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
