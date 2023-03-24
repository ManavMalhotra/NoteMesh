import NoteCard from "./NoteCard"

import {useEffect, useState, useContext} from "react"
import API_URL from "../utils/config"

import axios from "axios"

import { AuthContext } from "../AuthContext"

import Login from "./Login"

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const {user, setUser} = useContext(AuthContext);

  useEffect(() => {
    const fetchNotes = async () => {
      const res = await axios.get(`${API_URL}/api/notes`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      setNotes(res.data);
      const allTags = res.data.reduce((acc, note) => [...acc, ...note.tags], []);
      setTags([...new Set(allTags)]);
    };

    fetchNotes();
  }, [user.token]);

  const handleTagClick = (tag) => {
    const filteredNotes = notes.filter((note) => note.tags.includes(tag));
    setNotes(filteredNotes);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap justify-center mb-4">
        {tags.map((tag) => (
          <button
            key={tag}
            className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-full text-sm font-medium text-gray-700 mr-2 mb-2"
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      <Carousel
  responsive={{
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  }}
>
        {notes.map((note) => (
          <div key={note._id}>
            <NoteCard
              important={note.important}
              content={note.content}
              id={note._id}
              author={note.user.name}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Home;
