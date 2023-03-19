import { Link } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from "../Context";

const Navbar = () => {
  const { name, jwt, setName, setJwt } = useContext(MyContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setName("");
    setJwt("");
  };

  return (
    <div className="flex justify-around m-3 py-3 border-solid shadow-md">
      <Link to="/">
        <h1 className="">Home</h1>
      </Link>
      {name && jwt? (
        <>
          <h1>{name}</h1>
          <Link to="/new-note">
            <h1 className="">New Note</h1>
          </Link>
          <h1 onClick={handleLogout} className="cursor-pointer">
            Log Out
          </h1>
        </>
      ) : (
        <>
          <Link to="/login">
            <h1>Login</h1>
          </Link>
          <Link to="/register">
            <h1>Register</h1>
          </Link>
        </>
      )}
    </div>
  );
};

export default Navbar;
