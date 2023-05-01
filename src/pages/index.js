import Head from "next/head";
import Card from "../components/Card";
import ModalForm from "../components/ModalForm";
import Dropdown from "../components/Dropdown";
import { useState, useEffect } from "react";

async function fetchNotes() {
  let notes = [];
  try {
    const response = await fetch("http://localhost:3001/notes");
    notes = await response.json();
  } catch (error) {
    console.error("Error fetching notes:", error);
  }
  return notes;
}

export default function Home({ initialNotes }) {
  const [notes, setNotes] = useState(initialNotes);
  const [showArchived, setShowArchived] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);

  const handleCreateNote = async (title, content, tags) => {
    console.log(title, content, tags);
    try {
      const response = await fetch("http://localhost:3001/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, tags }),
      });
      const newNote = await response.json();
      setNotes([newNote, ...notes]);
      setModalVisible(false);
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3001/notes/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const updatedNotes = await fetchNotes();
      setNotes(updatedNotes);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleEdit = async (id, title, content, tags) => {
    try {
      const response = await fetch(`http://localhost:3001/notes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, tags }),
      });

      await response.json();
      const updatedNotes = await fetchNotes();
      setNotes(updatedNotes);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleEditButtonClick = (id, title, content, tags) => {
    setNoteToEdit({ id, title, content, tags });
    setModalVisible(true);
  };

  const handleArchive = async (id) => {
    try {
      const note = notes.find((note) => note.id === id);
      const newStatus = !note.status;

      await fetch(`http://localhost:3001/notes/${id}/archive`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      fetchNotes().then((updatedNotes) => {
        setNotes(updatedNotes);
      });
    } catch (error) {
      console.error("Error archiving/unarchiving note:", error);
    }
  };

  const filteredNotes = showArchived
    ? Array.isArray(notes)
      ? notes.filter((note) => !note.status)
      : []
    : Array.isArray(notes)
    ? notes.filter((note) => note.status)
    : [];

  // Extrae los tags únicos de las notas
  const uniqueTags = Array.from(
    new Set(
      notes.reduce((acc, note) => {
        return acc.concat(note.tags);
      }, [])
    )
  );

  // Convierte los tags en objetos compatibles con la prop "items" del componente Dropdown
  const tagItems = uniqueTags.map((tag) => ({
    slug: `#${tag}`,
    anchor: tag,
  }));

  // Filtra las notas según el tag seleccionado
  const handleTagSelection = (tag) => {
    setSelectedTag(tag);
  };

  const filteredNotesByTag = selectedTag
    ? filteredNotes.filter(
        (note) => note.tags && note.tags.includes(selectedTag)
      )
    : filteredNotes;

  return (
    <>
      <Head>
        <title>Ensolvers Notes</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <ModalForm
          modalVisible={modalVisible}
          toggleModal={() => setModalVisible(!modalVisible)}
          onCreateNote={handleCreateNote}
          isEditMode={noteToEdit !== null}
          noteToEdit={noteToEdit}
          onUpdateNote={handleEdit}
        />
        <div style={{ display: "flex" }}>
          <h1>{showArchived ? "My archived notes" : "My notes"}</h1>
          <button
            onClick={() => setModalVisible(true)}
            className={showArchived ? "hidde-button" : "button-create-note"}
          >
            Create Note
          </button>
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="buttons"
          >
            {showArchived ? "Back to notes" : "Archived notes"}
          </button>
        </div>

        <Dropdown
          dropdownTitle="Tag filter"
          items={tagItems}
          onItemSelected={handleTagSelection}
        />

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-start",
          }}
        >
          {filteredNotesByTag.map((note) => (
            <Card
              key={note.id}
              title={note.title}
              content={note.content}
              creationDate={new Date(note.creationDate)}
              updateDate={new Date(note.updateDate)}
              status={note.status}
              onDelete={() => handleDelete(note.id)}
              onEdit={() =>
                handleEditButtonClick(
                  note.id,
                  note.title,
                  note.content,
                  note.tags
                )
              }
              onArchive={() => handleArchive(note.id)}
            />
          ))}
        </div>
      </main>
    </>
  );
}

// import { fetchNotes } from "./index";
export async function getServerSideProps() {
  const initialNotes = await fetchNotes();

  return {
    props: { initialNotes },
  };
}
