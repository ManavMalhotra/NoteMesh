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
        <div className="">
            <h1 className="font-bold text-3xl font-sans bg-white rounded px-8 pt-6 pb-8 mb-4">Register</h1>
            
            <div className="px-3 py-3">
                <label className="block text-gray-700 font-bold mb-2">
                    Name:
                </label>
                <input onChange={(e)=>setName(e.target.value)} type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>

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


            <button onClick={submitHandler} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"> Sign In</button>
        </div>
    )
}

export default Login