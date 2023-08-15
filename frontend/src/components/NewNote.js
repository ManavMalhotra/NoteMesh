import { useContext, useState } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from "axios";
import API_URL from "../utils/config";
import "./NewNote.css"
const NewNote = () => {
  const { user } = useContext(AuthContext);
  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [important, setImportant] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  if (!localStorage.getItem('token')) {
    window.location.href = '/login';
  }

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleTitleChange = (value) => {
    setTitle(value);
  };

  const handleTagChange = (event) => {
    const newTag = event.target.value.trim();
    if (event.key === 'Enter' && newTag !== '' && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      event.target.value = '';
    }
  };

  const handleTagDelete = (index) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
  
    const newNote = {
      title,
      content
    };

    console.log(newNote)
  
    axios
      .post(`${API_URL}/api/notes`, newNote, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        }
      })
      .then(response => {
        console.log(response.data);
        setTitle("");
        setContent("");
        setIsLoading(false);
        navigate("/");
      })
      .catch(error => {
        console.log(error);
        setIsLoading(false);
      });
  };
  // container mx-auto p-8 mt-4 mb-4 border rounded 
  return (
    <div className="note">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4">
          <div className="my-3">
            <h1 className="text-lg lg:text-xl xl:text-2xl text-gray-700 font-bold mb-2">Title</h1>
            <input
              type="text"
              className="border border-gray-400 rounded w-full py-2 px-3"
              placeholder="Title"
              onChange={(e)=>setTitle(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <div className="mx-auto" style={{ minHeight: "10rem" }}>
              <ReactQuill
                value={content}
                onChange={handleContentChange}
                placeholder="Take a note..."
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ color: [] }, { background: [] }],
                    [{ align: [] }],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['link', 'image'],
                    ['clean'],
                  ],
                }}
              />
            </div>
          </div>
          <div className="my-2 mx-auto ">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewNote;
