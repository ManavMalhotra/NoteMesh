import { Link, redirect } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

import logo from "../assets/logo.png";

import { FaStickyNote, FaPlus, FaSignOutAlt } from "react-icons/fa";
import "./navbar.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function NavBar() {
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = () => {
    toast.success("Logout Successful", {
      position: "top-right",
      className: "foo-bar",
    });

    setTimeout(() => {
      localStorage.removeItem("token");
      setUser({
        name: "",
        token: "",
      });
      redirect("/");
    }, 2000);
  };

  return (
    <nav className="px-8 navbar bg-light">
      <ToastContainer position="top-center" autoClose={5000} theme="light" />

      <div className="navbar_content">
        {/* Logo Section */}
        <div className="navbar_brand">
          <Link to="/">
            <img src={logo} alt="Notemesh Logo" className="brand_img" />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="navbar_items">
          {!user.auth ? (
            <>
              <Link to="/login" className="nav_link">
                Login
              </Link>
              <Link to="/register" className="nav_link">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/" className="nav_link">
                <FaStickyNote /> My Notes
              </Link>
              {/* <Link to="/new-note" className="nav_link">
                <FaPlus /> Create New Note
              </Link> */}
              <button className="logout_btn" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </>
          )}
        </div>
      </div>

      <div class="block hidden menu--right" role="navigation">
        <div class="menuToggle">
          <input type="checkbox" />
          <span></span>
          <span></span>
          <span></span>
          <ul class="menuItem">
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">About</a>
            </li>
            <li>
              <a href="#">Info</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
            <li>
              <a href="#">Show me more</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
