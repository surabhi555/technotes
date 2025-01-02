const express = require('express');
const router = express.Router();
const {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote
} = require('../controllers/notesController.js');

// Route for getting all notes
router.get('/', getAllNotes);

// Route for creating a new note
router.post('/', createNewNote);

// Route for updating a note
router.patch('/', updateNote);

// Route for deleting a note
router.delete('/', deleteNote);

module.exports = router;
