import React, { useState } from "react";
import ReactDOM from "react-dom";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
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

function App() {
  return (
    <React.StrictMode>
      <AuthProvider>
        <div className="App">
          <NavBar />
          <Outlet />
          <Footer />
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
