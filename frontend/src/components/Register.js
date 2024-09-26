import { useState } from "react";
import API_URL from "../utils/config";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submitHandler = async () => {
    if (!name || !username || !password) {
      toast.warn("Please fill all fields", { position: "top-right" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        toast.success("Registration Successful", { position: "top-right" });
        navigate("/login");
      } else {
        const errorData = await response.json();
        toast.warn(errorData.error || "Registration Failed", {
          position: "top-right",
        });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <ToastContainer position="top-right" autoClose={5000} theme="light" />
      <div className="flex flex-col items-center p-4 m-8 rounded-md bg-slate-300">
        <h1 className="mb-4 text-2xl">Register</h1>

        <div className="flex justify-between w-full gap-1 px-3 py-3">
          <label>Name: </label>
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="John Doe"
            className="py-1 m-0 border-0 rounded"
          />
        </div>

        <div className="flex justify-between w-full gap-1 px-3 py-3">
          <label>UserName: </label>
          <input
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="JohnDoe"
            className="py-1 m-0 border-0 rounded"
          />
        </div>

        <div className="flex justify-between w-full gap-1 px-3 py-3">
          <label>Password: </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="johndoe123"
            className="py-1 m-0 border-0 rounded"
          />
        </div>

        <button
          className="btn btn-outline"
          onClick={submitHandler}
          disabled={loading}
        >
          Register
          {loading && (
            <span className="loading loading-spinner loading-md"></span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Register;
