import { useContext, useState } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import axios from "axios"

import API_URL from "../utils/config"

const NewNote = () => {

  const {user, setUser} = useContext(AuthContext);
  const [tags, setTags] = useState([])
  const [content, setContent] = useState("");
  const [important, setImportant] = useState(false);


  const navigate = useNavigate();

  if (!localStorage.getItem('token')) {
    window.location.href = '/login';
  }
  
  const handleContentChange = (value) => {
    setContent(value);
  }

  const handleTagChange = (event) => {
  const newTag = event.target.value.trim()
    if (event.key === 'Enter' && newTag !== '' && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      event.target.value = ''
    }
  }

  const handleTagDelete = (index) => {
    const newTags = [...tags]
    newTags.splice(index, 1)
    setTags(newTags)
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log(tags)

    const newNote = {
      content,
      tags: JSON.stringify(tags)
    }

    
    axios.post(`${API_URL}/api/notes`, newNote, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`
    }})
    .then(response => {
      console.log(response.data)
      setTags([])
      setContent('')
      navigate("/")
    })
    .catch(error => console.log(error))




  };
  return (

        <div className="container mx-F max-w-full mx-auto p-8 h-40 mt-4 ">
          <div className="flex flex-wrap justify-between">
            <div className="w-full lg:w-3/4 mb-4 mx-auto my-auto ">
              <ReactQuill
                style={{ height: "10rem" }}
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
              <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-16"
        onClick={handleSubmit}
      >
        Submit
      </button>
            </div>
        {/* <div className="w-full lg:w-1/4">
          <div className="flex flex-wrap items-center mb-2">
            {tags.map((tag, index) => (
              <div key={index} className="px-2 py-1 bg-gray-300 rounded-full mr-2 mb-2">
                {tag}
                <button onClick={() => handleTagDelete(index)} className="ml-2">
                  x
                </button>
              </div>
            ))}
          </div>
          <input type="text" className="w-full border border-gray-400 rounded py-2 px-3" placeholder="Add tags..." onKeyUp={handleTagChange} />
        </div> */}
      </div>
      
    </div>


  );
};

export default NewNote;
