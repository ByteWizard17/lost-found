import api from "./api";

// 🔐 LOGIN
export const login = async (email, password) => {
  try {
    console.log("🔐 Sending login request for:", email);

    const response = await api.post("/auth/login", {
      email,
      password,
    });

    console.log("✅ Login successful");

    return response.data;
  } catch (error) {
    console.error(
      "❌ Login error:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Login failed"
    );
  }
};

// 📝 REGISTER
export const register = async (name, email, password) => {
  try {
    console.log("📝 Sending registration request for:", email);

    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });

    console.log("✅ Registration successful");

    return response.data;
  } catch (error) {
    console.error(
      "❌ Registration error:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Registration failed"
    );
  }
};