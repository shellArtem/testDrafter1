import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Form, ListGroup, Alert, Spinner, Modal } from 'react-bootstrap';
import {
  setNotes,
  addNote,
  updateNote,
  deleteNote,
  setLoading,
  setError,
  selectNotes,
  selectLoading,
  selectError,
} from '../store/notesSlice';

const Home = () => {
  const dispatch = useDispatch();
  const notes = useSelector(selectNotes);
  const isLoading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const [formData, setFormData] = useState({ title: '', content: '' });
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [filter, setFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filteredNotes, setFilteredNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    const filtered = notes.filter(note =>
      note.title.toLowerCase().includes(filter.toLowerCase())
    );

    const sorted = filtered.sort((a, b) => {
      return sortOrder === 'asc'
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    });

    setFilteredNotes(sorted);
  }, [notes, filter, sortOrder]);

  const fetchNotes = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const response = await fetch('http://localhost:5000/api/notes');
      if (!response.ok) throw new Error('Ошибка при загрузке заметок');
      const data = await response.json();
      dispatch(setNotes(data));
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const note = { ...formData, createdAt: new Date().toISOString() };
      if (editId) {
        await fetch(`http://localhost:5000/api/notes/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(note),
        });
        dispatch(updateNote({ id: editId, ...note }));
      } else {
        await fetch('http://localhost:5000/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(note),
        });
        dispatch(addNote(note));
      }
      setFormData({ title: '', content: '' });
      setEditId(null);
      fetchNotes();
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleEdit = (note) => {
    setFormData({ title: note.title, content: note.content });
    setEditId(note.id);
  };

  const handleDelete = async (id) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: 'DELETE',
      });
      dispatch(deleteNote(id));
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleShowModal = (note) => {
    setSelectedNote(note);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedNote(null);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Список заметок</h1>
      {isLoading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group controlId="formTitle">
          <Form.Label>Заголовок</Form.Label>
          <Form.Control
            type="text"
            name="title"
            placeholder="Введите заголовок"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formContent">
          <Form.Label>Содержание</Form.Label>
          <Form.Control
            as="textarea"
            name="content"
            placeholder="Введите содержание"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          {editId ? 'Обновить' : 'Создать'}
        </Button>
      </Form>

      <Form.Group controlId="formFilter" className="mb-4">
        <Form.Label>Фильтровать по заголовку</Form.Label>
        <Form.Control
          type="text"
          placeholder="Введите текст для фильтрации"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="formSortOrder" className="mb-4">
        <Form.Label>Сортировать по дате</Form.Label>
        <Form.Control
          as="select"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Сначала новые</option>
          <option value="desc">Сначала старые</option>
        </Form.Control>
      </Form.Group>

      <ListGroup>
        {filteredNotes.map((note) => (
          <ListGroup.Item key={note.id} onClick={() => handleShowModal(note)} style={{ cursor: 'pointer' }}>
            <h5>{note.title}</h5>
            <p>{note.content}</p>
            <Button
              variant="warning"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(note);
              }}
              className="me-2"
            >
              Редактировать
            </Button>
            <Button
              variant="danger"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(note.id);
              }}
            >
              Удалить
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedNote?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{selectedNote?.content}</p>
          <small>Создано: {selectedNote?.createdAt ? new Date(selectedNote.createdAt).toLocaleString() : ''}</small>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;