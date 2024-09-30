import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.bubble.css";
import axios from "axios";
import API_URL from "../utils/config";
import CreatableSelect from "react-select/creatable";

const NewNote = () => {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTagLoading, setIsTagLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Debounce timer ref
  const debounceTimer = useRef(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    const sharedTitle = searchParams.get("title");
    const sharedText = searchParams.get("text");
    const sharedUrl = searchParams.get("url");

    if (sharedTitle || sharedText || sharedUrl) {
      setTags([{ value: "Shared", label: "Shared" }]);
      setTitle(sharedTitle || "Untitled");

      let newContent = sharedText || "";
      if (sharedUrl) newContent += `\\n\\n ${sharedUrl}`;
      setContent(newContent);
    }
  }, [searchParams, navigate, user.token]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTagChange = (newTags) => {
    setTags(newTags || []);
  };

  const handleInputChange = (input) => {
    setInputValue(input);
  };

  const handleKeyDown = (event) => {
    if (!inputValue) return;
    if (event.key === " ") {
      event.preventDefault();
      const newTag = { value: inputValue.trim(), label: inputValue.trim() };
      setTags((prevTags) => [...prevTags, newTag]);
      setInputValue(""); // Clear the input after creating the tag
    }
  };

  // Fetch tag suggestions with debounce
  const fetchTagSuggestions = useCallback(
    async (noteContent) => {
      if (!noteContent) return;

      setIsTagLoading(true);
      try {
        const response = await axios.post(
          `${API_URL}/api/notes/tag-suggestion`,
          { content: noteContent },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        const suggestedTags = response.data?.msg.tags || [];
        setTags(suggestedTags.map((tag) => ({ value: tag, label: tag })));
      } catch (error) {
        console.error("Error fetching tag suggestions:", error);
      } finally {
        setIsTagLoading(false);
      }
    },
    [user.token]
  );

  // Debounced content change handler
  const handleContentChange = (value) => {
    setContent(value);

    // Clear the previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set a new debounce timer
    debounceTimer.current = setTimeout(() => {
      fetchTagSuggestions(value);
    }, 2000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const newNote = {
      title,
      content,
      tags: tags.map((tag) => tag.value),
    };

    try {
      await axios.post(`${API_URL}/api/notes`, newNote, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      navigate("/");
    } catch (error) {
      console.error("Error creating note:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl p-6 mx-auto mt-10 bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="w-full mb-4 text-4xl font-semibold placeholder-gray-400 border-none outline-none"
          placeholder="Untitled"
          value={title}
          onChange={handleTitleChange}
        />

        <CreatableSelect
          isMulti
          value={tags}
          inputValue={inputValue}
          onInputChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onChange={handleTagChange}
          placeholder="Add tags..."
          className="mb-6"
          styles={{
            control: (provided) => ({
              ...provided,
              borderRadius: "6px",
              boxShadow: "none",
              border: "1px solid #E0E0E0",
              padding: "4px",
              minHeight: "40px",
            }),
          }}
        />

        <ReactQuill
          theme="bubble"
          value={content}
          onChange={handleContentChange}
          placeholder="Start writing here..."
          className="min-h-[300px] mb-6"
        />

        <div className="flex justify-end">
          <button
            className={`px-6 py-2 text-white transition duration-300 ease-in-out transform bg-blue-600 rounded-lg ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700 hover:scale-105"
            }`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Note"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewNote;
