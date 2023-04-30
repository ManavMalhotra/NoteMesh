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
        <div className="flex h-screen items-center ">
            <div className="flex items-center flex-col fw-full max-w-xs m-auto p-5 border-2 rounded " >
            <h1 className="text-2xl">Login</h1>
            
            <div className="w-full px-3 py-3 ">
                <label className="block">
                    User Name
                </label>
                <input onChange={(e)=>setUsername(e.target.value)} type="text" placeholder="Enter Username" className="border-2 px-2" />
            </div>

            <div className="w-full px-3 py-3">
                <label className="block">
                    Password
                </label>
                <input onChange={(e)=>setPassword(e.target.value)} type="password" 
                placeholder="Enter Password" className="border-2 px-2 py-1" />
            </div>
            <div class="w-full px-3 py-3">
                <input class="w-full py-2 px-4 rounded border-2 cursor-pointer" type="submit" value="Sign in" onClick={submitHandler} />
            </div>       

            </div>
        </div>
    )
}

export default Login