import { useState } from "react"

import { useContext } from "react"

import {AuthContext} from "../AuthContext"

import { useNavigate } from "react-router-dom"

import API_URL from "../utils/config"

console.log(API_URL)

const Login = ()=>{
    
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const {user, setUser} = useContext(AuthContext) 

    const navigate = useNavigate();

    const submitHandler = ()=>{
        const data = fetch(`${API_URL}/api/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(response => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("Network response was not ok.");
            }
          })
          .then(data => {
            setUser({
                name: data.name,
                token: data.token,
                auth: true
            })
            localStorage.setItem("token", data.token); 
            localStorage.setItem("name", data.name);

            navigate("/");
          })
          .catch(error => {
            console.error(error);
          });

          console.log(user.token)


    }
    return(
        <div className="">
            <h1 className="font-bold text-3xl font-sans bg-white rounded px-8 pt-6 pb-8 mb-4">Login</h1>
            
            <div className="px-3 py-3">
                <label className="block text-gray-700 font-bold mb-2">
                    User Name: 
                </label>
                <input onChange={(e)=>setUsername(e.target.value)} type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>

            <div className="px-3 py-3">
                <label className="block text-gray-700 font-bold mb-2">
                    Password: 
                </label>
                <input onChange={(e)=>setPassword(e.target.value)} type="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <button onClick={submitHandler} type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"> Sign In</button>
        </div>
    )
}

export default Login