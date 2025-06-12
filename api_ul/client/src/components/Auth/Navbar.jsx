import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Auth.css";
import { useContext } from "react";
import { ThemeContext } from "../../ThemeContext.jsx";

const Navbar = ({ user, onLogout, onToggleProfile }) => {
  // const navigate = useNavigate();
  // const isLoginPage = location.pathname === "/login";
  // const isRegisterPage = location.pathname === "/register";
  
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();

  // SVG for profile icon
  const profileSvg = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );


  
  // const handleLogout = () => {
  //   onLogout();
  //   navigate("/login");
  // };


  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img src="/client/public/assets/images/background.jpg" alt="Logo" />
        FileFlex
      </Link>
      <div className="navbar-auth-buttons">
        {user ? (
          <div className="user-section">
            <span className="welcome-message">
              Welcome, {user.fullName || "User"}
            </span>
            <div
              className="theme-toggle-switch"
              onClick={toggleTheme}
              role="button"
              tabIndex={0}
              aria-label={`Switch to ${
                theme === "light" ? "dark" : "light"
              } mode`}
            >
              <input type="checkbox" checked={theme === "dark"} readOnly />
              <span className="slider"></span>
            </div>
            <button
              className="profile-icon-button"
              onClick={onToggleProfile}
              aria-label="Toggle Profile"
            >
              {profileSvg}
            </button>
            <button className="logout-button" onClick={onLogout}>
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className={`auth-link ${
                location.pathname === "/login" ? "active" : "inactive"
              }`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`auth-link ${
                location.pathname === "/register" ? "active" : "inactive"
              }`}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;