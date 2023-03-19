import {Link} from "react-router-dom"
const NoteCard = ({ important, content, id }) => {
  return (
    <div className="relative inline-block border-solid border-2 border-stone-500 shadow-md rounded-md mx-6 my-6 px-4 py-4 w-64 h-64">
      <h2 className="text-lg font-semibold mb-2">Important: {important}</h2>
      <p className="text-gray-700">{content}</p>
      <Link to={`edit/${id}`}>
        <button key = {id} className="absolute bottom-0 right-0 m-2 py-1 px-2 bg-gray-200 rounded-md">
          Edit
        </button>
      </Link>
    </div>
  );
};

export default NoteCard;
