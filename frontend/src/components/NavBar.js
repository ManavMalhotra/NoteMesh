import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import {
  FaStickyNote,
  FaPlus,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/logo.png";

const NavBar = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

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
      navigate("/");
    }, 2000);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav
      className={`py-8 w-full z-10 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <ToastContainer position="top-center" autoClose={5000} theme="light" />
      <div className="container mx-auto">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Notemesh Logo" className="w-auto h-8" />
            <span className="text-xl font-bold text-gray-800"></span>
          </Link>

          {/* Desktop Menu */}
          <div className="items-center hidden space-x-4 md:flex">
            {!user.auth ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 transition duration-300 hover:text-gray-800"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-white transition duration-300 bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="flex items-center space-x-1 text-gray-600 transition duration-300 hover:text-gray-800"
                >
                  <FaStickyNote />
                  <span>My Notes</span>
                </Link>
                <Link
                  to="/new-note"
                  className="flex items-center space-x-1 text-gray-600 transition duration-300 hover:text-gray-800"
                >
                  <FaPlus />
                  <span>Create New Note</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-600 transition duration-300 hover:text-gray-800"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
          <div className="relative bottom-0 px-2 py-8 space-y-1 bg-white sm:px-3">
            {!user.auth ? (
              <div className="flex flex-col gap-4">
                <Link
                  to="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-base font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <>
                <Link
                  to="/"
                  className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50"
                >
                  My Notes
                </Link>
                <Link
                  to="/new-note"
                  className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50"
                >
                  Create New Note
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full px-3 py-2 text-base font-medium text-left text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
