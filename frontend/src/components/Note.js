import { useState, useEffect, useContext } from "react";
import API_URL from "../utils/config";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import DOMPurify from "dompurify";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const Note = () => {
    const [content, setContent] = useState("");
    const { id } = useParams();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const getData = async () => {
            fetch(`${API_URL}/api/notes/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch note content");
                    }
                    return response.json();
                })
                .then((data) => {
                    setContent(data.content);
                });
        };
        getData();
    }, []);

    return (
        <>
            <ReactQuill value={content} readOnly={true} />
        </>
    );
};

export default Note;
