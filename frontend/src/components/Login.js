import { useState } from "react";

import { useContext } from "react";

import { AuthContext } from "../AuthContext";

import { useNavigate } from "react-router-dom";

import API_URL from "../utils/config";

console.log(API_URL);

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { user, setUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const submitHandler = () => {
    const data = fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Network response was not ok.");
        }
      })
      .then((data) => {
        setUser({
          name: data.name,
          token: data.token,
          auth: true,
        });
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.name);

        navigate("/");
      })
      .catch((error) => {
        console.error(error);
      });

    console.log(user.token);
  };
  return (
    <div className="flex items-center justify-center ">
      <div className="flex flex-col items-center m-8 p-4 rounded-md bg-slate-300 ">
        <h1 className="text-2xl mb-4">Login</h1>

        <div className="w-full px-3 py-3 flex gap-1 justify-between">
          <label className="block">UserName: </label>
          <input
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Enter Username"
            className="border-0 rounded py-1 m-0"
          />
        </div>

        <div className="w-full px-3 py-3 flex gap-1 justify-between">
          <label className="block">Password: </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Enter Password"
            className="border-0 rounded py-1 m-0"
          />
        </div>
        <div class="w-full px-3 py-3">
          <input
            class="w-full py-2 px-4 font-bold rounded border-2 cursor-pointer hover:bg-slate-400 hover:border-slate-400 hover:text-white transition duration-300 ease-in-out"
            type="submit"
            value="Login"
            onClick={submitHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
