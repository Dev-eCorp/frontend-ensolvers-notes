import React from "react";

const ModalNote = ({
  modalVisible,
  toggleModal,
  note,
  onEdit,
  onDelete,
  onArchive,
}) => {
  return (
    <div className="container">
      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{note.title}</h2>
            <p className="note-content">{note.content}</p>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button className="buttons btn-note" onClick={onEdit}>
                Edit
              </button>
              <button className="buttons btn-note" onClick={onArchive}>
                {note.status ? "Archive" : "Unarchive"}
              </button>
              <button className="buttons btn-note" onClick={onDelete}>
                Delete
              </button>
            </div>
            <button className="cancel-button" onClick={toggleModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalNote;
