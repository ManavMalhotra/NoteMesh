import { Link, redirect } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

import logo from "../assets/logo.png";

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
    <nav className="bg-transparent navbar">
      <ToastContainer position="top-center" autoClose={5000} theme="light" />

      <div className="navbar_brand">
        <div>
          <Link to="/">
            <img src={logo} alt="Notemesh Logo" className="brand_img" />
          </Link>
        </div>
        {!user.auth ? (
          <div className="navbar_items">
            <Link to="/login"> Login </Link>
            <Link to="/register"> Register </Link>
          </div>
        ) : (
          <div className="navbar_items">
            <Link to="/" className="">
              My Notes
            </Link>
            <Link to="/new-note">Create New Note</Link>
            <Link to="/" onClick={handleLogout}>
              Logout
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
