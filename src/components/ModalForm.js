import React, { useState, useEffect } from "react";
import { AiFillCloseCircle } from "react-icons/ai";

const ModalForm = ({
  modalVisible,
  toggleModal,
  onCreateNote,
  onUpdateNote,
  isEditMode,
  noteToEdit,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (isEditMode) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
      setTags(noteToEdit.tags);
    }
  }, [isEditMode, noteToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      onUpdateNote(noteToEdit.id, title, content, tags);
    } else {
      onCreateNote(title, content, tags);
    }
    setTitle("");
    setContent("");
    setTags([]);
    toggleModal();
  };

  const handleAddTag = () => {
    setTags([...tags, tagInput]);
    setTagInput("");
  };

  const handleRemoveTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="container">
      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{isEditMode ? "Modify Note" : "Create new note"}</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <label htmlFor="content">Content:</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              <h3 style={{ marginBottom: "8px" }}>Tags:</h3>
              <div
                style={{
                  padding: "6px",
                  border: "2px solid black",
                  marginBottom: "12px",
                }}
              >
                {tags?.length > 0 &&
                  tags.map((tag, index) => (
                    <div
                      key={index}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(index)}
                        style={{
                          marginLeft: "4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        className="delete-button"
                      >
                        <AiFillCloseCircle />
                      </button>
                    </div>
                  ))}
              </div>

              <label htmlFor="tagInput">Add a tag:</label>
              <input
                type="text"
                id="tagInput"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="button-create-note"
              >
                Add Tag
              </button>

              <button type="submit">
                {isEditMode ? "Modify Note" : "Create note"}
              </button>
            </form>
            <button className="cancel-button" onClick={toggleModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalForm;
