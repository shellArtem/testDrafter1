import { createSlice } from '@reduxjs/toolkit';

const notesSlice = createSlice({
  name: 'notes',
  initialState: {
    notes: [],
    loading: false,
    error: null,
  },
  reducers: {
    setNotes(state, action) {
      state.notes = action.payload;
    },
    addNote(state, action) {
      state.notes.push(action.payload);
    },
    updateNote(state, action) {
      const index = state.notes.findIndex(note => note.id === action.payload.id);
      if (index !== -1) {
        state.notes[index] = action.payload;
      }
    },
    deleteNote(state, action) {
      state.notes = state.notes.filter(note => note.id !== action.payload);
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  setNotes,
  addNote,
  updateNote,
  deleteNote,
  setLoading,
  setError,
} = notesSlice.actions;

export const selectNotes = state => state.notes.notes;
export const selectLoading = state => state.notes.loading;
export const selectError = state => state.notes.error;

export default notesSlice.reducer;