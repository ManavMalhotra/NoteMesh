import NoteCard from "./NoteCard";

import { useEffect, useState, useContext } from "react";
import API_URL from "../utils/config";

import axios from "axios";

import { useAuth } from "../AuthContext";

import Login from "./Login";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Landing from "./Landing";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const { user, setUser } = useAuth()

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

    fetchNotes();
    
  }, []);

  const handleTagClick = (tag) => {
    const filteredNotes = notes.filter((note) => note.tags.includes(tag));
    setNotes(filteredNotes);
  };
  console.log(notes);

  if (!user.auth) {
    return (
      
        <Landing />
      
    );
  }
  return (
    <div className="container mx-auto p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {notes.map(note => (
          <NoteCard
            key={note._id}
            important={note.important}
            title={note.title}
            content={note.content}
            id={note._id}
          />
        ))}
      </div>
    </div>

    )
  
};

export default Home;