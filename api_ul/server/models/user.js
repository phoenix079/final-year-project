export const getStoredUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Store user in localStorage
export const storeUser = (userData) => {
  localStorage.setItem("user", JSON.stringify(userData));
};

// Remove user from localStorage
export const removeStoredUser = () => {
  localStorage.removeItem("user");
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const user = getStoredUser();
  return !!user?.token;
};

// Get auth headers for API requests
export const getAuthHeaders = () => {
  const user = getStoredUser();
  if (user?.token) {
    return {
      Authorization: `Bearer ${user.token}`,
    };
  }
  return {};
};

// Format user data for display
export const formatUserData = (user) => {
  return {
    id: user.id || user._id,
    name: user.name,
    email: user.email,
    // Add any other user properties you want to expose
  };
};
