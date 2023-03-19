import { useContext, useState } from "react";
import { MyContext } from "../Context";
import { useNavigate } from "react-router-dom";

import Api_Url from "../utils/config"

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

    fetch(`${Api_Url}/api/notes`, {
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
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          name="content"
          rows="4"
          cols="50"
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="important">Important:</label>
        <input
          id="important"
          name="important"
          type="checkbox"
          checked={important}
          onChange={(event) => setImportant(event.target.checked)}
        />
      </div>
      <button type="submit">Create Note</button>
    </form>
  );
};

export default NewNote;
