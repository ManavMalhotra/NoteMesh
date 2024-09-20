import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { debounce } from 'lodash';
import Quill from "quill";
import "quill/dist/quill.snow.css";

import API_URL from "../utils/config";


const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [content, setContent] = useState("");
  const [quill, setQuill] = useState(null); // Store Quill instance
  const contentRef = useRef("");

  
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
  ];
  
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
        contentRef.current = data.content;
        if (quill) {
          quill.setContents(quill.clipboard.convert(data.content));
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id, user.token, quill]);

  const autoSave = useCallback(
    debounce(async () => {
      try {
        const response = await fetch(`${API_URL}/api/notes/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ content: contentRef.current }),
        });

        if (!response.ok) {
          throw new Error("Failed to auto-save note content");
        }

        console.log("Note auto-saved successfully");
      } catch (error) {
        console.error("Error auto-saving note:", error);
      }
    }, 1000),
    [id, user.token]
  );

  useEffect(() => {
    if (quill) {
      const textChangeHandler = (delta, oldDelta, source) => {
        if (source === "user") {
          contentRef.current = quill.root.innerHTML;
          autoSave();
        }
      };

      quill.on("text-change", textChangeHandler);

      return () => {
        quill.off("text-change", textChangeHandler);
      };
    }
  }, [quill, autoSave]);

  const handleQuillRef = useCallback((node) => {
    if (node !== null) {
      const newQuill = new Quill(node, {
        theme: "snow",
        modules: { toolbar: TOOLBAR_OPTIONS },
      });
      setQuill(newQuill);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // You can keep this method for any final actions or explicit save functionality
    console.log("Note finalized");
    navigate("/");
  };

  return (
    <div className="edit-note">
      <h2>Edit Note</h2>
      <form onSubmit={handleSubmit}>
        <div ref={handleQuillRef} style={{ height: "400px", marginBottom: "20px" }}></div>
        <button type="submit">Save and Exit</button>
      </form>
    </div>
  );
};

export default EditNote;
