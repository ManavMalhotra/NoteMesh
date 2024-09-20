import React, { useEffect, useState, useCallback } from "react";
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
  const [activeTag, setActiveTag] = useState(null);

  const tags = React.useMemo(() => {
    const allTags = notes.reduce((acc, note) => [...acc, ...note.tags], []);
    return [...new Set(allTags)];
  }, [notes]);

  const handleTagClick = useCallback((tag) => {
    setActiveTag(tag === activeTag ? null : tag);
  }, [activeTag]);

  const filteredNotes = React.useMemo(() => {
    return activeTag
      ? notes.filter((note) => note.tags.includes(activeTag))
      : notes;
  }, [notes, activeTag]);

  if (!user.auth) return <Landing />;
  if (isLoading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen">Error: {error.message}</div>;

  return (
    <div className="container p-8 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Notes</h1>
        <button
          className="px-4 py-2 text-white transition-colors bg-blue-500 rounded-full hover:bg-blue-600"
          onClick={() => navigate("/new-note")}
        >
          + New Note
        </button>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap mb-6">
          <button
            onClick={() => setActiveTag(null)}
            className={`px-3 py-1 m-1 text-sm rounded-full transition-colors ${
              activeTag === null
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-3 py-1 m-1 text-sm rounded-full transition-colors ${
                activeTag === tag
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {filteredNotes.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-xl text-gray-500">No notes found. Create your first note!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredNotes.map((note) => (
            <MemoizedNoteCard
              key={note._id}
              important={note.important}
              title={note.title}
              content={note.content}
              id={note._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;