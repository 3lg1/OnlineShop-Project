import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { currentUser, setCurrentUser } = useAppContext();

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleLogout = () => {
    logout();
    logout();
    setCurrentUser(null);
    setIsNavOpen(false);
    navigate("/login");
    navigate("/login");
  };
  const navbarStyle = {
    minHeight: "60px",
    zIndex: 1050,
  };
  const logoStyle = {
    width: "25px",
    height: "25px",
    objectFit: "cover" as const,
    borderRadius: "8px",
    marginRight: "8px",
  };
  const brandStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold" as const,
  };
  const togglerStyle = {
    padding: "4px 8px",
    fontSize: "1.25rem",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  };
  const navLinkStyle = {
    transition: "all 0.3s ease",
    borderRadius: "4px",
    margin: "2px",
    padding: "8px 16px",
  };
  const collapseStyle = {
    backgroundColor: "rgba(33, 37, 41, 0.95)",
    marginTop: "10px",
    borderRadius: "8px",
    padding: "10px",
  };
  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top"
      style={navbarStyle}
    >
      <div className="container-fluid px-3">
        {/* Brand */}
        <div className="d-flex align-items-center">
          <img src="shopping.png" alt="iShopping Logo" style={logoStyle} />
          <Link to="/" className="navbar-brand text-white" style={brandStyle}>
          <Link to="/" className="navbar-brand text-white" style={brandStyle}>
            iShopping
          </Link>
          </Link>
        </div>
        {/* Hamburger toggle */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNav}
          aria-controls="navbarNavAltMarkup"
          aria-expanded={isNavOpen}
          aria-label="Toggle navigation"
          style={togglerStyle}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        {/* Navigation links */}
        <div
          className={`collapse navbar-collapse ${isNavOpen ? "show" : ""}`}
          id="navbarNavAltMarkup"
          style={isNavOpen ? collapseStyle : {}}
        >
          <div className="navbar-nav ms-auto text-center">
            {["home", "about", "contact", "product"].map((link) => (
              <Link
              <Link
                key={link}
                to={`/${link}`}
                to={`/${link}`}
                className="nav-link text-white"
                onClick={() => setIsNavOpen(false)}
                style={navLinkStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {link.charAt(0).toUpperCase() + link.slice(1)}
              </Link>
              </Link>
            ))}
            {currentUser ? (
              <div className="nav-item dropdown">
                <button
                  className="btn btn-dark dropdown-toggle"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    fontWeight: "bold",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  {currentUser.name}
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="userDropdown"
                >
                  <li>
                    {currentUser.role === "admin" ? (
                      <Link
                        to="/admindashboard"
                        className="dropdown-item"
                        onClick={() => setIsNavOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    ) : (
                      <Link
                        to="/userdashboard"
                        className="dropdown-item"
                        onClick={() => setIsNavOpen(false)}
                      >
                        User Dashboard
                      </Link>
                    )}
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      Dil
                    </button>
                  </li>
                </ul>
              </div>
              <div className="nav-item dropdown">
                <button
                  className="btn btn-dark dropdown-toggle"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    fontWeight: "bold",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  {currentUser.name}
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="userDropdown"
                >
                  <li>
                    {currentUser.role === "admin" ? (
                      <Link
                        to="/admindashboard"
                        className="dropdown-item"
                        onClick={() => setIsNavOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    ) : (
                      <Link
                        to="/userdashboard"
                        className="dropdown-item"
                        onClick={() => setIsNavOpen(false)}
                      >
                        User Dashboard
                      </Link>
                    )}
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      Dil
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link
                to="/login"
              <Link
                to="/login"
                className="nav-link text-white"
                onClick={() => setIsNavOpen(false)}
                style={navLinkStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Log In
              </Link>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;

// Funksioni logout
function logout() {
  localStorage.removeItem("token");
  delete axios.defaults.headers.common["Authorization"];
  delete axios.defaults.headers.common["Authorization"];
}