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
    <div className=" flex border-2 m-4 p-4 lg:flex-row w-72 h-52 sm:flex-col sm:w-56 sm:h-40 md:" >

      <div dangerouslySetInnerHTML={{ __html: (mySafeHTML.substring(0, 100)) }} >
      </div>

      <div>
      <Link to={`edit/${id}`} 
      className="
      inline-block
      md:relative md:-top-32 md:left-40 
      sm:relative sm:-top-28 sm:left-44 ">
            <img src={pencilIcon} alt="Edit Note" className=" max-md:h-4 h-6 w-auto" />
        </Link>
      </div>
    </div>
  )
};

export default NoteCard;
