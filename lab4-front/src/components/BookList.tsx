import { useEffect, useState } from 'react';
import type { Book, BookFormData } from '../types/Book';
import { bookService } from '../services/bookService';
import { BookItem } from './BookItem';
import { BookForm } from './BookForm';
import { BookDetails } from './BookDetails';

export function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookService.getAllBooks();
      setBooks(data);
    } catch (err) {
      setError('Error al cargar los libros.');
      console.error('Error loading books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBook = async (formData: BookFormData) => {
    try {
      setLoading(true);
      const newBook = await bookService.createBook(formData);
      setBooks((prev) => [newBook, ...prev]);
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError('Error al crear el libro');
      console.error('Error creating book:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBook = async (formData: BookFormData) => {
    if (!editingBook) return;

    try {
      setLoading(true);
      const updatedBook = await bookService.updateBook(editingBook.id!, formData);
      setBooks((prev) =>
        prev.map((book) => (book.id === editingBook.id ? updatedBook : book))
      );
      setEditingBook(null);
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError('Error al actualizar el libro');
      console.error('Error updating book:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (id: number) => {
    try {
      setLoading(true);
      await bookService.deleteBook(id);
      setBooks((prev) => prev.filter((book) => book.id !== id));
      if (selectedBook?.id === id) {
        setSelectedBook(null);
      }
      setError(null);
    } catch (err) {
      setError('Error al eliminar el libro');
      console.error('Error deleting book:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBook(null);
  };

  const filteredBooks = books.filter((book) =>
    book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbnNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="book-list-container">
      <div className="main-content">
        <div className="list-section">
          <div className="list-header">
            <h1>Biblioteca de Libros</h1>
            <button
              className="btn btn-primary"
              onClick={() => {
                setEditingBook(null);
                setShowForm(true);
              }}
              disabled={loading}
            >
              Nuevo Libro
            </button>
          </div>

          {error && <div className="error-banner">{error}</div>}

          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar por nombre, autor o ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading && <div className="loading">Cargando libros...</div>}

          {!loading && filteredBooks.length === 0 ? (
            <div className="empty-state">
              <p>
                {searchTerm
                  ? 'No se encontraron libros con ese criterio'
                  : 'No hay libros registrados aún'}
              </p>
            </div>
          ) : (
            <div className="books-grid">
              {filteredBooks.map((book) => (
                <BookItem
                  key={book.id}
                  book={book}
                  onEdit={handleEditBook}
                  onDelete={handleDeleteBook}
                  onView={setSelectedBook}
                  isLoading={loading}
                />
              ))}
            </div>
          )}
        </div>

        {(showForm || selectedBook) && (
          <div className="sidebar">
            {showForm ? (
              <BookForm
                book={editingBook}
                onSubmit={editingBook ? handleUpdateBook : handleCreateBook}
                onCancel={handleCloseForm}
                isLoading={loading}
              />
            ) : (
              <BookDetails
                book={selectedBook}
                onClose={() => setSelectedBook(null)}
                onEdit={handleEditBook}
                onDelete={handleDeleteBook}
                isLoading={loading}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
