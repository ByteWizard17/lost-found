import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminLogin = location.pathname === "/admin-login";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError(`${isAdminLogin ? "Admin email" : "Email"} is required`);
      return;
    }
    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    setLoading(true);
    try {
      const data = await login(email, password);

      if (isAdminLogin) {
        if (data.user?.role !== "admin") {
          setError("This account does not have admin access.");
          return;
        }
        navigate("/admin");
        return;
      }

      navigate(data.user?.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(
        `${isAdminLogin ? "Admin login" : "Login"} failed: ` +
          (err.message || "Please check your credentials")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{isAdminLogin ? "Admin Login" : "Welcome Back"}</h2>
          <p>
            {isAdminLogin
              ? "Sign in with your admin account to open the dashboard"
              : "Login to your account"}
          </p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          {error && <p className="error-message">{error}</p>}

          <div className="form-group">
            <label>{isAdminLogin ? "Admin Email" : "Email Address"}</label>
            <input
              type="email"
              placeholder={isAdminLogin ? "admin@example.com" : "your.email@example.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder={
                isAdminLogin ? "Enter your admin password" : "Enter your password"
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading
              ? isAdminLogin
                ? "Signing in..."
                : "Logging in..."
              : isAdminLogin
                ? "Open Admin Dashboard"
                : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isAdminLogin ? (
              <>
                Not an admin? <Link to="/login">Go to user login</Link>
              </>
            ) : (
              <>
                Don't have an account? <Link to="/register">Register here</Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
