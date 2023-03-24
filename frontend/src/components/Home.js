import NoteCard from "./NoteCard"

import {useEffect, useState, useContext} from "react"
import API_URL from "../utils/config"

import axios from "axios"

import { AuthContext } from "../AuthContext"

import Login from "./Login"

const Home = ()=>{
    const [data, setData] = useState("")

    const {user, setUser} = useContext(AuthContext)

    const [token, setToken] = useState("")


    

    useEffect(() => {

    setToken(localStorage.getItem('token'))
        const getData = async () => {
            const response = await axios.get(`${API_URL}/api/notes`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `bearer ${token}`
                }
            })
        //   const response = await fetch(`${API_URL}/api/notes`, {
        //         method: "GET",
        //         headers: {
        //             "Content-Type": "application/json",
        //             "Authorization": `bearer ${token}`
        //         }
        //     });
          const data = await response.json();
          console.log(data)
          setData(data);      
        }
      
        getData();

    }, []);

    return (
        <>
            {
                (true) ? 
                    (
                        <div className="flex flex-wrap">
                            {Array.from(data).map(info => (
                                <NoteCard 
                                    key={info._id}
                                    important={info.important}
                                    content={info.content}
                                    id={info._id}
                                    author={info.user.name}
                                />
                            ))
                            }
                        </div>
                    ) : 
                        (
                            <Login />
                        )
            }
        </>
    )
    
}

export default Home