import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

import API_URL from "../utils/config"

const NoteCard = ({ content, id , author}) => {

  const { user } = useContext(AuthContext);

  const onDelete = () => {
      fetch(`${API_URL}/api/notes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`
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
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 w-full">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">Harcdcoded</h3>
          <div className="flex">
            <Link to={`/edit/${id}`}>
            <button
              className="text-blue-500 font-medium mr-4 hover:text-blue-700"
            >
              Edit
            </button>
            </Link>
            <button
              onClick={onDelete}
              className="text-red-500 font-medium hover:text-red-700"
            >
              Delete
            </button>
          </div>
        </div>
        <p className="text-gray-700">{content}</p>
      </div>
    );
    };

export default NoteCard;
