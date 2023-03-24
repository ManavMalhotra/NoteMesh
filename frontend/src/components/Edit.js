import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../AuthContext";

import API_URL from "../utils/config"

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [content, setContent] = useState("");
  const [important, setImportant] = useState(false);

  useEffect(() => {
    
    fetch(`${API_URL}/api/notes/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${user.token}`
      }
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
  },);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Submit updated note content to the backend
    fetch(`${API_URL}/api/notes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify({ content: content })
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update note content");
        }
        return response.json();
      })
      .then(() => {
        // Redirect to home page after successful update
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 w-full">
      <h2 className="text-lg font-medium mb-3">Add New Note</h2>
      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label htmlFor="content" className="block text-gray-700 font-medium mb-2">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={e => setContent(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full"
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="important" className="inline-flex items-center">
            <input
              type="checkbox"
              id="important"
              checked={important}
              onChange={e => setImportant(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-500"
            />
            <span className="ml-2 text-gray-700 font-medium">Mark as Important</span>
          </label>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-medium rounded py-2 px-4"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditNote;
