import { Link, redirect } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

import logo from "../assets/logo.png";

import "./navbar.css";

export default function NavBar() {
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser({
      name: "",
      token: "",
    });
    // redirect to / 
    redirect("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar_brand">
        <div>
          <Link to="/">
            <img src={logo} alt="Notemesh Logo" className="brand_img" />
          </Link>
        </div>
        { !user.auth ? (
          <div className="navbar_items">
            <Link to="/login"> Login </Link>
            <Link to="/register"> Register </Link>
          </div>
        ) : (
          <div className="navbar_items">
            <Link to="/">My Notes</Link>
            <Link to="/new-note">Create New Note</Link>
            <Link to="/" onClick={handleLogout}>Logout</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
