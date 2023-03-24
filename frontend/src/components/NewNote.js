import { useContext, useState } from "react";
import { MyContext } from "../Context";
import { useNavigate } from "react-router-dom";

import API_URL from "../utils/config"

const NewNote = () => {

  const navigate = useNavigate();

  if (!localStorage.getItem('token')) {
    window.location.href = '/login';
  }
  const storedToken = localStorage.getItem('token');
  const jwt = storedToken;
  

  const [content, setContent] = useState("");
  const [important, setImportant] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch(`${API_URL}/api/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ content, important }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create new note");
        }
        return response.json();
      })
      .then((data) => {
        console.log("New note created:", data);
        setContent("");
        setImportant(false);
        navigate("/")
        
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

export default NewNote;
