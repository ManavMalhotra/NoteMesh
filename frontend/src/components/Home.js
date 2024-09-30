import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../utils/config";
import { useAuth } from "../AuthContext";
import NoteCard from "./NoteCard";
import Landing from "./Landing";
import Masonry from "react-masonry-css";

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

  const handleTagClick = useCallback(
    (tag) => {
      setActiveTag(tag === activeTag ? null : tag);
    },
    [activeTag]
  );

  const filteredNotes = React.useMemo(() => {
    return activeTag
      ? notes.filter((note) => note.tags.includes(activeTag))
      : notes;
  }, [notes, activeTag]);

  if (!user.auth) return <Landing />;
  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        Error: {error.message}
      </div>
    );

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <div className="container p-8 mx-auto bg-black rounded-lg">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">My Notes</h1>
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
                ? "bg-white text-black"
                : " bg-transparent border border-gray-400 text-gray-400"
            }`}
          >
            All ({notes.length})
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-3 py-1 m-1 text-sm rounded-full transition-colors ${
                activeTag === tag
                  ? "bg-white text-black"
                  : " bg-transparent border border-gray-400 text-gray-400"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {filteredNotes.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-xl text-gray-500">
            No notes found. Create your first note!
          </p>
        </div>
      ) : (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {filteredNotes.map((note) => (
            <MemoizedNoteCard
              key={note._id}
              important={note.important}
              title={note.title}
              content={note.content}
              id={note._id}
            />
          ))}
        </Masonry>
      )}
    </div>
  );
};

export default Home;
