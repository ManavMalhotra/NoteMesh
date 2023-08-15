import { useState } from "react";
import API_URL from "../utils/config";

import { useNavigate } from "react-router-dom";
const Login = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const submitHandler = () => {
    const data = fetch(`${API_URL}/api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        username: username,
        password: password,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // parse response data as JSON
        } else {
          throw new Error("Network response was not ok.");
        }
      })
      .then((data) => {
        console.log(data);

        navigate("/");

        // setToken(data.token); // set token state
        localStorage.setItem("token", data.token); // save token to local storage
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div className="flex items-center justify-center  ">
      <div className="flex flex-col items-center m-8 p-4 rounded-md bg-slate-300 ">
        <h1 className="text-2xl mb-4">Register</h1>

        <div className="w-full px-3 py-3 flex gap-1 justify-between">
          <label className="block">Name: </label>
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="John Doe"
            className="border-0 rounded py-1 m-0"
          />
        </div>

        <div className="w-full px-3 py-3 flex justify-between gap-1">
          <label className="block">UserName: </label>
          <input
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="JohnDoe"
            className="border-0 rounded py-1 m-0"
          />
        </div>

        <div className="w-full px-3 py-3 flex justify-between gap-1">
          <label className="block">Password: </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="johndoe123"
            className="border-0 rounded py-1 m-0"
          />
        </div>
        <div class="w-full px-3 py-3">
          <input
            class="w-full py-2 px-4 font-bold rounded border-2 cursor-pointer hover:bg-slate-400 hover:border-slate-400 hover:text-white transition duration-300 ease-in-out"
            type="submit"
            value="Register"
            onClick={submitHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
