import "@radix-ui/themes/styles.css";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useNavigate,
} from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Edit from "./components/Edit";
import NewNote from "./components/NewNote";
import Note from "./components/Note";
import { AuthProvider } from "./AuthContext";
import "./index.css";
import VerticalNav from "./components/VerticalNav";

function App() {
  const navigate = useNavigate();

  // Function to check if the token is expired
  const isTokenExpired = (token) => {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const expirationTime = decodedToken.exp * 1000;
    return expirationTime < Date.now(); // Check if the current time is beyond token expiration
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    // If no token or the token is expired, redirect to the login page
    if (!token || isTokenExpired(token)) {
      alert("Session expired. Please log in again.");
      localStorage.removeItem("token"); // Clear expired token from localStorage
      navigate("/login"); // Redirect to the login page
    }
  }, [navigate]);

  return (
    <React.StrictMode>
      <AuthProvider>
        <div className="bg-[#F8F8F9] h-screen">
          <NavBar className="" />
          <Outlet className="" />
        </div>
      </AuthProvider>
    </React.StrictMode>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/new-note",
        element: <NewNote />,
      },
      {
        path: "/view/:id",
        element: <Note />,
      },
      {
        path: "/edit/:id",
        element: <Edit />,
      },
    ],
  },
]);

ReactDOM.render(
  <RouterProvider router={router} />,
  document.getElementById("root")
);
