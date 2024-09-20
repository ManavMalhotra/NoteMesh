import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import pencilIcon from "../assets/pencilIcon.svg";
import API_URL from "../utils/config";
import DOMPurify from "dompurify";

const NoteCard = React.memo(({ id, content, title }) => {
  const { user } = useAuth();

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/api/notes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete note");
      }
      window.location.reload();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const renderContent = () => {
    return { __html: DOMPurify.sanitize(content) };
  };

  return (
    <div className="p-6 transition duration-300 ease-in-out transform bg-white rounded-lg shadow-md hover:scale-105 hover:shadow-lg">
      <h3 className="mb-3 text-xl font-semibold text-gray-800">{title}</h3>
      <div
        className="mb-4 overflow-y-auto text-gray-600 max-h-36"
        dangerouslySetInnerHTML={renderContent()}
      />
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
        <Link
          to={`/view/${id}`}
          className="text-blue-600 transition duration-300 ease-in-out hover:text-blue-800"
        >
          View
        </Link>
        <div className="flex space-x-2">
          <Link to={`/edit/${id}`}>
            <img
              src={pencilIcon}
              alt="Edit"
              className="w-6 h-6 text-gray-600 transition duration-300 ease-in-out cursor-pointer hover:text-blue-500"
            />
          </Link>
          <button
            onClick={handleDelete}
            className="text-red-600 transition duration-300 ease-in-out hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
});

export default NoteCard;
