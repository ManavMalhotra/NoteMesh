import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { FaTrashAlt } from "react-icons/fa";
import pencilIcon from "../assets/pencilIcon.svg";
import API_URL from "../utils/config";
import DOMPurify from "dompurify";

const NoteCard = ({ id, content, title }) => {
  const { user } = useContext(AuthContext);
  const [isHover, setIsHover] = useState(false);
  const [linkMetadata, setLinkMetadata] = useState({
    thumbnail: null,
    linkTitle: "",
    description: "",
  });

  const gradientColors = isHover
    ? "bg-gradient-to-tr from-gray-200 via-white to-gray-100"
    : "bg-gradient-to-tr from-white to-gray-200";

  useEffect(() => {
    let isCanceled = false;

    const fetchMetadata = async (url) => {
      const cacheKey = `metadataCache_${url}`;
      const cachedData = localStorage.getItem(cacheKey);

      if (cachedData) {
        setLinkMetadata(JSON.parse(cachedData));
        return;
      }

      try {
        const response = await fetch(
          `https://api.linkpreview.net/?key=b54a1f1ef15ad52c504b7abb98ba829c&q=${url}`
        );

        if (response.status === 429) {
          console.error("You are being rate limited.");
          return;
        }

        const data = await response.json();
        const metadata = {
          thumbnail: data.image,
          linkTitle: data.title,
          description:
            data.description.length > 30
              ? `${data.description.substring(0, 30)}...`
              : data.description,
        };

        if (!isCanceled) {
          setLinkMetadata(metadata);
          localStorage.setItem(cacheKey, JSON.stringify(metadata));
        }
      } catch (error) {
        console.error("Error fetching metadata:", error);
      }
    };

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = content.match(urlRegex);

    if (urls) {
      fetchMetadata(urls[0]); // Fetch metadata for the first URL found
    }

    return () => {
      isCanceled = true;
    };
  }, [content]);

  const createClickableLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });
  };

  const renderContent = () => {
    const sanitizedContent = DOMPurify.sanitize(content, {
      USE_PROFILES: { html: true },
    });
    const linkedContent = createClickableLinks(sanitizedContent);
    return { __html: linkedContent };
  };

  const onDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );
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

  return (
    <div
      className={`${gradientColors} bg-white rounded-2xl shadow-lg p-6 transition duration-300 ease-in-out transform hover:scale-105`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <h3 className="mb-3 text-xl font-semibold text-gray-800">{title}</h3>
      {linkMetadata.linkTitle && (
        <>
          <h4 className="text-lg font-medium text-gray-800">
            {linkMetadata.linkTitle}
          </h4>
          <p className="text-sm text-gray-600">{linkMetadata.description}</p>
        </>
      )}
      {linkMetadata.thumbnail && (
        <img
          src={linkMetadata.thumbnail}
          alt="Preview"
          className="mb-2 rounded"
        />
      )}
      <div
        className="mb-4 overflow-y-auto text-gray-700 max-h-36 word-wrap"
        style={{ WebkitOverflowScrolling: "touch" }}
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
