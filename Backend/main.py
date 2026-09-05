from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal
from models import Note
from schemas import NoteCreate, NoteUpdate

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://notes-api-olive.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Hello
@app.get("/hello")
def hello():
    return {"message": "Notes API is running"}


# CREATE
@app.post("/notes")
def create_note(note: NoteCreate):

    db = SessionLocal()

    new_note = Note(
        title=note.title,
        content=note.content
    )

    db.add(new_note)
    db.commit()
    db.refresh(new_note)

    db.close()

    return {
        "message": "Note created",
        "note": new_note
    }


# READ ALL
@app.get("/notes")
def get_notes():

    db = SessionLocal()

    notes = db.query(Note).all()

    db.close()

    return {
        "notes": notes
    }

# READ ONE NOTE
@app.get("/notes/{note_id}")
def get_note(note_id: int):

    db = SessionLocal()

    existing_note = (
        db.query(Note)
        .filter(Note.id == note_id)
        .first()
    )

    if existing_note is None:
        db.close()
        return {
            "message": "Note not found"
        }

    db.close()

    return {
        "note": existing_note
    }


# UPDATE
@app.put("/notes/{note_id}")
def update_note(note_id: int, note: NoteUpdate):

    db = SessionLocal()

    existing_note = (
        db.query(Note)
        .filter(Note.id == note_id)
        .first()
    )

    if existing_note is None:
        db.close()
        return {
            "message": "Note not found"
        }

    existing_note.title = note.title
    existing_note.content = note.content

    db.commit()
    db.refresh(existing_note)

    db.close()

    return {
        "message": "Note updated",
        "note": existing_note
    }


# DELETE
@app.delete("/notes/{note_id}")
def delete_note(note_id: int):

    db = SessionLocal()

    existing_note = (
        db.query(Note)
        .filter(Note.id == note_id)
        .first()
    )

    if existing_note is None:
        db.close()
        return {
            "message": "Note not found"
        }

    db.delete(existing_note)
    db.commit()

    db.close()

    return {
        "message": "Note deleted successfully"
    }
