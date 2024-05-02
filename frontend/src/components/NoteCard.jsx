import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../AuthContext";
import pencilIcon from "../assets/pencilIcon.svg";
import API_URL from "../utils/config";
import DOMPurify from "dompurify";


const NoteCard = ({ id, content, title }) => {
  const { user } = useContext(AuthContext);
  const [isHover, setIsHover] = useState(false);
  const gradientColors = isHover
    ? "bg-gradient-to-tr from-gray-300 to-gray-100"
    : "bg-gradient-to-tr from-white to-gray-300";

  const handleCardClick = () => {
    window.location.href = `/view/${id}`;
  };

  // const handleDelete = () => {
  //   fetch(`${API_URL}/api/notes/${id}`, {
  //     method: "DELETE",
  //     headers: {
  //       Authorization: `Bearer ${jwt}`
  //     }
  //   })
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch note content");
  //       }
  //       window.location.reload()
  //       return response.json();
  //     })
  // }

  const onDelete = () => {
    fetch(`${API_URL}/api/notes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch note content");
      }
      window.location.reload();
      return response.json();
    });
  };
  console.log(content)

  const renderContent = () => {
    return { __html: content };
  };


  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div
        className="text-gray-600 overflow-y-auto max-h-36"
        dangerouslySetInnerHTML={renderContent()}
      />
      <div className="flex justify-end mt-4">
        <Link to={`edit/${id}`}>
        <img src={pencilIcon} className="h-6 w-6 text-gray-600 hover:text-blue-500 cursor-pointer" />
        </Link>
      </div>
    </div>
  );
};

export default NoteCard;
