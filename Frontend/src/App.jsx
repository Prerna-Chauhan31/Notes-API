import { useEffect, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [notes, setNotes] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [selectedNote, setSelectedNote] = useState(null);

  const [editingNote, setEditingNote] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // GET ALL NOTES
  const fetchNotes = () => {
    fetch(`${API_URL}/notes`)
      .then((response) => response.json())
      .then((data) => {
        setNotes(data.notes);
      });
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // CREATE NOTE
  const createNote = (event) => {
    event.preventDefault();

    if (title.trim() === "" && content.trim() === "") {
      alert("Please enter a title or content.");
      return;
    }

    fetch(`${API_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        content: content,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        setTitle("");
        setContent("");
        setShowForm(false);
        fetchNotes();
      });
  };

  // READ ONE
  const readNote = (noteId) => {
    fetch(`${API_URL}/notes/${noteId}`)
      .then((response) => response.json())
      .then((data) => {
        setSelectedNote(data.note);
      });
  };

  // START EDITING
  const startEditing = (note) => {
    setEditingNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  // UPDATE
  const updateNote = (event) => {
    event.preventDefault();

    fetch(`${API_URL}/notes/${editingNote.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: editTitle,
        content: editContent,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        setEditingNote(null);
        setEditTitle("");
        setEditContent("");
        fetchNotes();
      });
  };

  // DELETE
  const deleteNote = (noteId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmDelete) {
      return;
    }

    fetch(`${API_URL}/notes/${noteId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        fetchNotes();
      });
  };

  return (
    <div className="app">

      {/* HEADER */}

      <h1>My Notes</h1>

      <p className="subtitle">
        your thoughts, organized
      </p>

      {/* CREATE BUTTON */}

      <button
        className="create-button"
        onClick={() => setShowForm(!showForm)}
      >
        + Create New Note
      </button>

      {/* CREATE FORM */}

      {showForm && (
        <form className="note-form" onSubmit={createNote}>

          <input
            type="text"
            placeholder="Note title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <textarea
            placeholder="Write your note..."
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />

          <button type="submit">
            Save Note
          </button>

        </form>
      )}

      {/* RECENTLY CREATED */}

      <h2 className="recently-created">
        {notes.length === 0 ? "No notes yet" : "Recently Created"}
      </h2>

      {/* NOTES */}

      <div className="notes-container">

        {notes.map((note) => (

          <div className="note-card" key={note.id}>

            <h3>{note.title}</h3>

            <p>{note.content}</p>

            <div className="note-actions">

              <button onClick={() => readNote(note.id)}>
                Read
              </button>

              <button onClick={() => startEditing(note)}>
                Edit
              </button>

              <button onClick={() => deleteNote(note.id)}>
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* EDIT FORM */}

      {editingNote && (

        <form className="edit-form" onSubmit={updateNote}>

          <h2>Edit Note</h2>

          <input
            type="text"
            placeholder="Note title"
            value={editTitle}
            onChange={(event) => setEditTitle(event.target.value)}
          />

          <textarea
            placeholder="Write your note..."
            value={editContent}
            onChange={(event) => setEditContent(event.target.value)}
          />

          <div className="edit-actions">

            <button type="submit">
              Update Note
            </button>

            <button
              type="button"
              onClick={() => setEditingNote(null)}
            >
              Cancel
            </button>

          </div>

        </form>

      )}

      {/* READ ONE NOTE */}

      {selectedNote && (

        <div className="read-note">

          <h2>{selectedNote.title}</h2>

          <p>{selectedNote.content}</p>

          <button onClick={() => setSelectedNote(null)}>
            Close
          </button>

        </div>

      )}

    </div>
  );
}

export default App;