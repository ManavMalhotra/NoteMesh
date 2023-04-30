import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../AuthContext";
import pencilIcon from "../assets/pencilIcon.svg";
import API_URL from "../utils/config";
import DOMPurify from "dompurify";


const NoteCard = ({ content, id, author }) => {
  const { user } = useContext(AuthContext);
  const [isHover, setIsHover] = useState(false);
  const gradientColors = isHover
    ? "bg-gradient-to-tr from-gray-300 to-gray-100"
    : "bg-gradient-to-tr from-white to-gray-300";

  const handleCardClick = () => {
    window.location.href = `/view/${id}`;
  };

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

const mySafeHTML = DOMPurify.sanitize(content);


  return (
<div class="card px-8 py-8 mx-5 my-5 border-2 w-64 h-64 rounded-md relative">
  <div class="card-content">
    <p dangerouslySetInnerHTML={{ __html: (mySafeHTML.substring(0, 100)) }} ></p>
  </div>
  <Link to={`edit/${id}`} >
    <img src={pencilIcon} class="absolute bottom-4 left-4 h-6" />
  </Link>  
</div>

  )
};

export default NoteCard;
