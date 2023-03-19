import NoteCard from "./NoteCard"

import {useEffect, useState} from "react"

const Home = ()=>{

    const [data, setData] = useState("")
    
    useEffect(() => {
        const getData = async () => {
          const response = await fetch("https://manavmalhotra-probable-space-eureka-x46rj6r7q5f59q-3001.preview.app.github.dev/api/notes");
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