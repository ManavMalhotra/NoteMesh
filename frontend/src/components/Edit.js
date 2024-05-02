import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import Quill from "quill";
import "quill/dist/quill.snow.css";

import API_URL from "../utils/config";

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [content, setContent] = useState("");
  const [quill, setQuill] = useState(null); // Store Quill instance
  const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
  ]
  
  useEffect(() => {
    // Fetch note content from API and set to Quill editor
    fetch(`${API_URL}/api/notes/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch note content");
        }
        return response.json();
      })
      .then((data) => {
        setContent(data.content);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id, user.token]);

  useEffect(() => {
    // Create and initialize Quill editor
    if (quill) {
      quill.setContents(quill.clipboard.convert(content));

      // Listen for text changes in the Quill editor
      quill.on("text-change", (delta, oldDelta, source) => {
        if (source === "user") {
          const updatedContent = quill.root.innerHTML;
          setContent(updatedContent);
        }
      });
    }
  }, [quill, content]);

  const handleQuillRef = useCallback((node) => {
    if (node !== null) {
      setQuill(new Quill(node, {
        theme: "snow",
        modules: { toolbar: TOOLBAR_OPTIONS },
      }));
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Submit updated note content to the backend
      const response = await fetch(`${API_URL}/api/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ content: quill.root.innerHTML }),
      });

      if (!response.ok) {
        throw new Error("Failed to update note content");
      }

      console.log("Note updated successfully");

      // Redirect to home page after successful update
      navigate("/");
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div ref={handleQuillRef}></div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditNote;
