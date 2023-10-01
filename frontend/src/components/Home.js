import NoteCard from "./NoteCard";
import { useEffect, useState, useContext } from "react";
import API_URL from "../utils/config";
import axios from "axios";
import { useAuth } from "../AuthContext";
import Login from "./Login";
import Landing from "./Landing.js";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const { user, setUser } = useAuth();

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

  const navigate = useNavigate();

  const handleTagClick = (tag) => {
    const filteredNotes = notes.filter((note) => note.tags.includes(tag));
    setNotes(filteredNotes);
  };
  console.log(notes);

  if (!user.auth) {
    return <Landing />;
  }
  return (
    <>
      {notes.length === 0 ? (
        <div className="flex items-center justify-center ">
          <div className="flex flex-col items-center p-4 m-8 rounded-md bg-slate-300 ">
            <h1 className="text-2xl font-bold text-center text-slate-900">
              You have no notes yet
            </h1>
            <p className="text-lg text-center text-slate-900">
              Click on the button below to add your first note
            </p>
            <button
              className="px-4 py-2 mt-4 font-bold text-white rounded-md bg-slate-900 hover:bg-slate-800"
              onClick={() => navigate("/new-note")}
            >
              Add Note
            </button>
          </div>
        </div>
      ) : (
        <div className="container p-8 mx-auto">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
            {notes.map((note) => (
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
      )}
    </>
  );
};

export default Home;
