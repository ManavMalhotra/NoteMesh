import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import axios from "axios";
import API_URL from "../utils/config";
import CreatableSelect from "react-select/creatable";

const NewNote = () => {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const sharedTitle = searchParams.get("title");
    const sharedText = searchParams.get("text");
    const sharedUrl = searchParams.get("url");

    if (sharedTitle || sharedText || sharedUrl) {
      setTags([{ value: "Shared", label: "Shared" }]);
      // Update the title if `title` parameter is present
      setTitle("Untitled")
      if (sharedTitle) setTitle(sharedTitle);

      // Construct the content from `text` and `url` parameters
      let newContent = "";
      if (sharedText) newContent += sharedText;
      if (sharedUrl) newContent += `\n\n ${sharedUrl}`;

      // Update the content state
      setContent(newContent);
    }
  }, [searchParams]);

  useEffect(() => {
    console.log("NewNote component mounted");

    if (!localStorage.getItem("token")) {
      console.log("No token found, redirecting to login");
      navigate("/login");
      return;
    }

    const handleSharedContent = async (sharedContent) => {
      console.log("Handling shared content:", sharedContent);
      if (sharedContent) {
        setIsLoading(true);
        try {
          const newNote = {
            title: sharedContent.title || "Shared Note",
            content: `${sharedContent.text || ""}\n\n${
              sharedContent.url || ""
            }`,
            tags: ["shared"],
          };
          console.log("Attempting to create new note:", newNote);

          const response = await axios.post(`${API_URL}/api/notes`, newNote, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          });
          console.log("Note created successfully:", response.data);

          // Navigate to the home page after saving
          navigate("/");
        } catch (error) {
          console.error("Error creating note:", error);
          // You might want to show an error message to the user here
        } finally {
          setIsLoading(false);
        }
      }
    };

    const setupServiceWorker = async () => {
      if ("serviceWorker" in navigator) {
        try {
          const registration = await navigator.serviceWorker.ready;
          console.log("Service Worker is ready");

          registration.active.postMessage({ type: "GET_SHARED_CONTENT" });

          const messageHandler = (event) => {
            console.log("Message received in NewNote:", event.data);
            if (event.data && event.data.type === "SHARED_CONTENT") {
              handleSharedContent(event.data.content);
            }
          };

          navigator.serviceWorker.addEventListener("message", messageHandler);

          return () => {
            navigator.serviceWorker.removeEventListener(
              "message",
              messageHandler
            );
          };
        } catch (error) {
          console.error("Error setting up service worker:", error);
        }
      } else {
        console.log("Service Workers are not supported");
      }
    };

    setupServiceWorker();
  }, [navigate, user.token]);

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTagChange = (newTags) => {
    setTags(newTags || []);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-32 h-32 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl p-6 mx-auto mt-10 bg-white rounded-lg shadow-lg">
      {/* Add a debug button for testing */}
      <button
        onClick={() => {
          if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
              type: "SHARED_CONTENT",
              content: {
                title: "Debug Shared Title",
                text: "This is a debug shared content.",
                url: "https://example.com/debug",
              },
            });
            console.log("Debug share event simulated");
          } else {
            console.log("Service Worker controller not available");
          }
        }}
        className="px-4 py-2 mb-4 text-gray-800 bg-gray-200 rounded"
      >
        Simulate Share (Debug)
      </button>

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

export default NewNote;
