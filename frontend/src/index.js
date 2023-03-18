import { createBrowserRouter, Outlet, RouterProvider} from "react-router-dom";
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import Home from "./components/Home"
import Login from "./components/Login"
import Register from "./components/Register"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

function App() {
  
  return (
    <div className="App">

      <Navbar />

      <Outlet />

      <Footer />

    </div>
  )
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
    ],
  },
])


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <RouterProvider router = {router} />
)

