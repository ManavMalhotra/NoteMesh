import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../AuthContext";
import { FaTrashAlt } from "react-icons/fa"; // Import delete icon
import pencilIcon from "../assets/pencilIcon.svg";
import API_URL from "../utils/config";
import DOMPurify from "dompurify";

const NoteCard = ({ id, content, title }) => {
  const { user } = useContext(AuthContext);
  const [isHover, setIsHover] = useState(false);
  const gradientColors = isHover
    ? "bg-gradient-to-tr from-gray-200 via-white to-gray-100"
    : "bg-gradient-to-tr from-white to-gray-200";

  const handleCardClick = () => {
    window.location.href = `/view/${id}`;
  };

  const onDelete = () => {
    const confirmed = window.confirm("Are you sure you want to delete this note?");
    if (confirmed) {
      fetch(`${API_URL}/api/notes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete note");
          }
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const renderContent = () => {
    return { __html: DOMPurify.sanitize(content) }; // Sanitize content for safety
  };

  return (
    <div
      className={`${gradientColors} bg-white rounded-lg shadow-lg p-6 transition duration-300 ease-in-out transform hover:scale-105`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <h3 className="mb-3 text-xl font-semibold text-gray-800">{title}</h3>
      <div
        className="mb-4 overflow-y-auto text-gray-700 max-h-36"
        dangerouslySetInnerHTML={renderContent()}
      />
      <div className="flex justify-between mt-4">
        <Link to={`edit/${id}`}>
          <img
            src={pencilIcon}
            className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-500"
            alt="Edit Note"
          />
        </Link>
        <FaTrashAlt
          className="w-6 h-6 text-gray-600 cursor-pointer hover:text-red-500"
          onClick={onDelete}
        />
      </div>
    </div>
  );
};

export default NoteCard;