import { useState } from "react"
import API_URL from "../utils/config"

import { useNavigate } from "react-router-dom"
const Login = ()=>{
    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    const submitHandler = ()=>{
        const data = fetch(`${API_URL}/api/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                username: username,
                password: password
            })
        })
        .then(response => {
            if (response.ok) {
              return response.json(); // parse response data as JSON
            } else {
              throw new Error("Network response was not ok.");
            }
          })
          .then(data => {
            console.log(data);

            navigate("/")

            // setToken(data.token); // set token state
            localStorage.setItem("token", data.token); // save token to local storage
        
          })
          .catch(error => {
            console.error(error);
          });
          


    }
    return(
        <div className="flex h-screen items-center ">
            <div className="flex items-center flex-col fw-full max-w-xs m-auto p-5 border-2 rounded " >
            <h1 className="text-2xl">Register</h1>
            
            <div className="w-full px-3 py-3 ">
                <label className="block">
                    Name
                </label>
                <input onChange={(e)=>setName(e.target.value)} type="text" placeholder="Enter Name" className="border-2 px-2" />
            </div>

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
                <input class="w-full py-2 px-4 rounded border-2 cursor-pointer" type="submit" value="Register" onClick={submitHandler} />
            </div>       

            </div>
        </div>
    )
}

export default Login