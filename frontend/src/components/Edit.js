import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.bubble.css";
import axios from "axios";
import API_URL from "../utils/config";
import "./NewNote.css";
import CreatableSelect from "react-select/creatable";

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTagLoading, setIsTagLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const debounceTimer = useRef(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/notes/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const { title, content, tags } = response.data;
        setTitle(title);
        setContent(content);
        setTags(tags.map((tag) => ({ value: tag, label: tag })));
      } catch (error) {
        console.error("Error fetching note:", error);
      }
    };
    fetchNote();
  }, [id, user.token]);
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
  
  const handleInputChange = (input) => {
    setInputValue(input);
  };

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

  const handleKeyDown = (event) => {
    if (!inputValue) return;
    if (event.key === " ") {
      event.preventDefault();
      const newTag = { value: inputValue.trim(), label: inputValue.trim() };
      setTags((prevTags) => [...prevTags, newTag]);
      setInputValue(""); // Clear the input after creating the tag
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTagChange = (newTags) => {
    setTags(newTags || []);
  };

  const autoSave = useCallback(
    async (updatedNote) => {
      try {
        await axios.put(`${API_URL}/api/notes/${id}`, updatedNote, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });
        console.log("Note auto-saved successfully");
      } catch (error) {
        console.error("Error auto-saving note:", error);
      }
    },
    [id, user.token]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const updatedNote = {
        title,
        content,
        tags: tags.map((tag) => tag.value),
      };
      autoSave(updatedNote);
    }, 1000);

    return () => clearTimeout(timer);
  }, [title, content, tags, autoSave]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const updatedNote = {
      title,
      content,
      tags: tags.map((tag) => tag.value),
    };

    try {
      await axios.put(`${API_URL}/api/notes/${id}`, updatedNote, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      navigate("/");
    } catch (error) {
      console.error("Error updating note:", error);
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
          modules={{
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image"],
              ["clean"],
            ],
          }}
          className="min-h-[300px] mb-6"
        />

        <div className="flex justify-end">
          <button
            className={`px-6 py-2 text-white transition duration-300 ease-in-out transform bg-blue-600 rounded-lg ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700 hover:scale-105"
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-white animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              "Save Note"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditNote;
