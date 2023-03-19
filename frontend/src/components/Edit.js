import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MyContext } from "../Context";

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jwt } = useContext(MyContext);
  const [noteContent, setNoteContent] = useState("");

  useEffect(() => {
    // Fetch note content from the backend using note ID
    fetch(`https://manavmalhotra-probable-space-eureka-x46rj6r7q5f59q-3001.preview.app.github.dev/api/notes/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch note content");
        }
        return response.json();
      })
      .then((data) => {
        setNoteContent(data.content);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id, jwt]);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Submit updated note content to the backend
    fetch(`https://manavmalhotra-probable-space-eureka-x46rj6r7q5f59q-3001.preview.app.github.dev/api/notes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`
      },
      body: JSON.stringify({ content: noteContent })
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
    <div className="container mx-auto my-4">
      <h1 className="text-3xl font-bold mb-4">Edit Note</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="noteContent">
            Note Content
          </label>
          <textarea
            id="noteContent"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="8"
            value={noteContent}
            onChange={(event) => setNoteContent(event.target.value)}
            required
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Update Note
        </button>
      </form>
    </div>
  );
};

export default EditNote;
