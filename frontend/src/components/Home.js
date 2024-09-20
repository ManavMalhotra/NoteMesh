import React, { useEffect, useState, useContext, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../utils/config";
import { useAuth } from "../AuthContext";
import NoteCard from "./NoteCard";
import Landing from "./Landing";

const MemoizedNoteCard = React.memo(NoteCard);

const useNotes = (token) => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/notes`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setNotes(res.data);
      } catch (error) {
        console.error("Failed to fetch notes:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [token]);

  return { notes, setNotes, isLoading, error };
};

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { notes, setNotes, isLoading, error } = useNotes(user.token);

  const tags = useMemo(() => {
    const allTags = notes.reduce((acc, note) => [...acc, ...note.tags], []);
    return [...new Set(allTags)];
  }, [notes]);

  const handleTagClick = useCallback((tag) => {
    const filteredNotes = notes.filter((note) => note.tags.includes(tag));
    setNotes(filteredNotes);
  }, [notes, setNotes]);

  if (!user.auth) {
    return <Landing />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (notes.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center p-4 m-8 rounded-md bg-slate-300">
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
    );
  }

  return (
    <div className="container p-8 mx-auto">
      <div className="mb-4">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className="px-2 py-1 m-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {notes.map((note) => (
          <div key={note._id}>
            <MemoizedNoteCard
              important={note.important}
              title={note.title}
              content={note.content}
              id={note._id}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;