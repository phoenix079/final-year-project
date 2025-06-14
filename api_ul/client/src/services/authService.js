import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";
const FILES_API_URL = "http://localhost:5000/api/files";

// Set up axios defaults
axios.defaults.headers.post["Content-Type"] = "application/json";

//axios for login
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

//axios for fetching current user
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("user");
    if (!user) return null;
    const parsedUser = JSON.parse(user);
    if (!parsedUser?.token) {
      console.warn("Invalid user data in localStorage, clearing");
      localStorage.removeItem("user");
      return null;
    }
    return parsedUser;
  } catch (error) {
    console.error("Error parsing user data:", error);
    localStorage.removeItem("user");
    return null;
  }
};

//delete account feature axios
export const deleteAccount = async () => {
  try {
    const user = getCurrentUser();
    if (!user?.token) {
      throw new Error("No user token found");
    }
    await axios.delete(`${API_URL}/delete`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    localStorage.removeItem("user");
    return true;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete account"
    );
  }
};

//fetch files in profile axios
export const fetchUserFiles = async () => {
  try {
    const user = getCurrentUser();
    if (!user?.token) {
      throw new Error("No user token found");
    }
    const response = await axios.get(FILES_API_URL, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch files");
  }
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
