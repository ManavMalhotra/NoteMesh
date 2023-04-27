import NoteCard from "./NoteCard";
import { useEffect, useState, useContext } from "react";
import API_URL from "../utils/config";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import Login from "./Login";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchNotes = async () => {
      const res = await axios.get(`${API_URL}/api/notes`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      setNotes(res.data);
      const allTags = res.data.reduce(
        (acc, note) => [...acc, ...note.tags],
        []
      );
      setTags([...new Set(allTags)]);
    };

    // fetchNotes();
    
  }, []);

  console.log(notes);
  return (

    <>
    HELLO
    </>
    // <div className="flex flex-wrap justify-content">

    // {Array.from(notes).map(info => (
    //     <NoteCard
    //         key={info._id}
    //         important={info.important}
    //         content={info.content}
    //         id = {info._id}
    //     />
    // ))}

    // </div>
    
    );
  
}

export default Home;
