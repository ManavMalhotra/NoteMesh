import { useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import API_URL from "../utils/config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

console.log(API_URL);

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    let timer;
    if (snackbar) {
      timer = setTimeout(() => {
        setSnackbar(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [snackbar]);

  const navigate = useNavigate();

  const submitHandler = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Login Successful", {
          position: "top-right",
          className: "foo-bar",
        });
        setUser({
          name: data.name,
          token: data.token,
          auth: true,
        });
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.name);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        toast.warn("Invalid Credentials", {
          position: "top-right",
          className: "foo-bar",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred", {
        position: "top-right",
        className: "foo-bar",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center ">
      <ToastContainer position="top-center" autoClose={5000} theme="light" />

      <div className="flex flex-col items-center p-4 m-8 rounded-md bg-slate-300 ">
        <h1 className="mb-4 text-2xl">Login</h1>

        <div className="flex justify-between w-full gap-1 px-3 py-3">
          <label className="block">UserName: </label>
          <input
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Enter Username"
            className="py-1 m-0 border-0 rounded"
          />
        </div>

        <div className="flex justify-between w-full gap-1 px-3 py-3">
          <label className="block">Password: </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Enter Password"
            className="py-1 m-0 border-0 rounded"
          />
        </div>
        <button className="btn btn-outline" onClick={submitHandler}>
          Login
          {loading ? (
            <span className="loading loading-spinner loading-md"></span>
          ) : null}
        </button>
        {snackbar ? (
          <div className="flex flex-col px-2 py-1 my-4 text-white bg-red-600 rounded md:flex-row ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 stroke-current shrink-0"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>Warning: Invalid email address or password!</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Login;
