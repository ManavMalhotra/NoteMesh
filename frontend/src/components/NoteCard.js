import { Link } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from "../Context";

import API_URL from "../utils/config"

const NoteCard = ({ important, content, id }) => {

  const { jwt } = useContext(MyContext);

  const handleDelete = () => {
      fetch(`${API_URL}/api/notes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch note content");
          }
          window.location.reload()
          return response.json();
        })
    }
  

  return (
    <div className="relative inline-block border-solid border-2 border-stone-500 shadow-md rounded-md mx-6 my-6 px-4 py-4 w-64 h-64">
      <h2 className="text-lg font-semibold mb-2">Important: {important}</h2>
      <p className="text-gray-700">{content}</p>
      <div className="absolute bottom-0 right-0 m-2 space-x-2">
        <Link to={`edit/${id}`}>
          <button className="py-1 px-2 bg-gray-200 rounded-md">Edit</button>
        </Link>
        <button
          key={`delete/${id}`} className="py-1 px-2 bg-red-500 text-white rounded-md"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
