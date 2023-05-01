import React, { useState } from "react";
import {
  FaRegStickyNote,
  FaTrashAlt,
  FaEdit,
  FaArchive,
  FaUndo,
} from "react-icons/fa";
import moment from "moment";
import ModalNote from "./ModalNote";

const Card = ({
  title,
  content,
  creationDate,
  updateDate,
  status,
  onDelete,
  onEdit,
  onArchive,
}) => {
  const previewContent =
    content.length > 50 ? content.slice(0, 50) + "..." : content;
  const isUpdated = moment(creationDate).isSame(moment(updateDate), "second");

  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <>
      <div className="note-card">
        <div
          onClick={() => setModalVisible(true)}
          style={{ cursor: "pointer" }}
        >
          <FaRegStickyNote className="note-icon" />
          <h3 className="note-title">{title}</h3>
          <p className="note-content">{previewContent}</p>
          <div className="note-dates">
            <p>
              Fecha de creación:{" "}
              {moment(creationDate).format("DD/MM/YYYY HH:mm:ss")}
            </p>
            {!isUpdated && (
              <p>
                Última actualización:{" "}
                {moment(updateDate).format("DD/MM/YYYY HH:mm:ss")}
              </p>
            )}
          </div>
        </div>

        <div className="note-actions">
          <button className="edit-button" onClick={onEdit}>
            {status && <FaEdit />}
          </button>
          <button className="archive-button" onClick={onArchive}>
            {status ? <FaArchive /> : <FaUndo />}
          </button>
          <button className="delete-button" onClick={onDelete}>
            <FaTrashAlt />
          </button>
        </div>
      </div>
      <ModalNote
        modalVisible={modalVisible}
        toggleModal={toggleModal}
        note={{ title, content, status }}
        onEdit={() => {
          setModalVisible(false);
          onEdit();
        }}
        onDelete={onDelete}
        onArchive={onArchive}
      />
    </>
  );
};

export default Card;
