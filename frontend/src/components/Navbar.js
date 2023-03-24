import { Link } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../AuthContext"

const Navbar = () => {
  const { user, setUser} = useContext(AuthContext)


  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser({
      name: "",
      token: "",
    })
  };
  return (
    <nav className="bg-blue-500 px-4 py-3">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-white font-bold text-xl">
          Sample Logo
        </Link>
        <div className="flex">
          <Link
            to="/"
            className="text-white font-medium mx-3 hover:underline"
          >
            Home
          </Link>
          {
            (!user.auth) ? 
            (
              <>
                <Link
                  to="/login"
                  className="text-white font-medium mx-3 hover:underline" >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="text-white font-medium mx-3 hover:underline"
                >
                Sign up
                </Link>
              </>
            ) 
            : 
            (
              <>

                <Link
                  to="/new-note" 
                  className="text-white font-medium mx-3 hover:underline">
                  Create New Note
                </Link>

                
                <h1 onClick={handleLogout}
                  className="text-white font-medium mx-3 hover:underline">
                  Logout
                </h1>
          
              </>
            )
          }

        </div>
      </div>
    </nav>
  );

}

export default Navbar
