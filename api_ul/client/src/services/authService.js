import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// Set up axios defaults
axios.defaults.headers.post["Content-Type"] = "application/json";

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    const data = response.data;
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    const data = response.data;
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Optional: Add request interceptor to include auth token if available
axios.interceptors.request.use(
  (config) => {
    const user = getCurrentUser();
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// const API_URL = "http://localhost:5000/api/auth";

// export const login = async (credentials) => {
//   const response = await fetch(`${API_URL}/login`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(credentials),
//   });
//   const data = await response.json();
//   if (!response.ok) {
//     throw new Error(data.message || "Login failed");
//   }
//   localStorage.setItem("user", JSON.stringify(data));
//   return data;
// };

// export const register = async (userData) => {
//   const response = await fetch(`${API_URL}/register`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(userData),
//   });
//   const data = await response.json();
//   if (!response.ok) {
//     throw new Error(data.message || "Registration failed");
//   }
//   localStorage.setItem("user", JSON.stringify(data));
//   return data;
// };

// export const logout = () => {
//   localStorage.removeItem("user");
// };

// export const getCurrentUser = () => {
//   const user = localStorage.getItem("user");
//   return user ? JSON.parse(user) : null;
// };
