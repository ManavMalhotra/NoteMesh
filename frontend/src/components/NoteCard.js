import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../AuthContext";

import API_URL from "../utils/config"

const NoteCard = ({ content, id , author}) => {

  const { user } = useContext(AuthContext);
  const [isHover, setIsHover] = useState(false);
    const gradientColors = isHover ? 'bg-gradient-to-tr from-blue-300 to-purple-400' : 'bg-gradient-to-tr from-white to-gray-300';


    const handleCardClick = () => {
    // Handle opening of full note content here
  };


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

          <div className={`relative w-72 h-52 rounded-lg shadow-lg overflow-hidden ${gradientColors} p-4`} onClick={handleCardClick} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
      <h2 className="text-xl font-medium mb-2">"Hardcoded TITLE"</h2>
      <p className="text-gray-700">{content.substring(0, 100)}</p>
      <div className="absolute bottom-0 left-0 w-full p-4">
        <p className="text-sm text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>


    );
    };

export default NoteCard;
