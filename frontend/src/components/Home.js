import NoteCard from "./NoteCard"

import {useEffect, useState} from "react"
import Api_Url from "../utils/config"
const Home = ()=>{

    const [data, setData] = useState("")
    
    useEffect(() => {
        const getData = async () => {
          const response = await fetch(`${Api_Url}/api/notes`);
          const data = await response.json();
          console.log(data)
          console.log(data[0].important)
          setData(data);
        };
      
        getData();

    }, []);
      
   


    return (
        <div className="flex flex-wrap">

{Array.from(data).map(info => (
    <NoteCard
        key={info._id}
        important={info.important}
        content={info.content}
        id = {info._id}
    />
))}

            
      
        </div>
    )
}

export default Home