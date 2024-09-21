const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

let notes = [
  { id: 1, title: 'Заметка 1', content: 'Содержание заметки 1', createdAt: new Date().toISOString() },
  { id: 2, title: 'Заметка 2', content: 'Содержание заметки 2', createdAt: new Date().toISOString() },
  { id: 3, title: 'Заметка 3', content: 'Содержание заметки 3', createdAt: new Date().toISOString() },
  { id: 4, title: 'Заметка 4', content: 'Содержание заметки 4', createdAt: new Date().toISOString() },
];

app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const newNote = {
    id: notes.length + 1,
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  notes.push(newNote);
  res.status(201).json(newNote);
});

app.put('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  const index = notes.findIndex((note) => note.id == id);

  if (index === -1) {
    return res.status(404).json({ message: 'Заметка не найдена' });
  }

  notes[index] = { ...notes[index], ...req.body };
  res.json(notes[index]);
});

app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  const index = notes.findIndex((note) => note.id == id);

  if (index === -1) {
    return res.status(404).json({ message: 'Заметка не найдена' });
  }

  notes.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Сервер работает на http://localhost:${PORT}`);
});
