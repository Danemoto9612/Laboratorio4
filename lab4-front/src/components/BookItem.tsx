import type { Book } from '../types/Book';

interface BookItemProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: number) => void;
  onView: (book: Book) => void;
  isLoading?: boolean;
}

export function BookItem({ book, onEdit, onDelete, onView, isLoading = false }: BookItemProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`¿Está seguro de que desea eliminar "${book.name}"?`)) {
      onDelete(book.id!);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(book);
  };

  return (
    <div className="book-item" onClick={() => onView(book)}>
      <div className="book-header">
        <h3>{book.name}</h3>
        <span className={`book-type ${book.type.toLowerCase()}`}>{book.type}</span>
      </div>
      <p className="book-author">por {book.author}</p>
      <p className="book-isbn">ISBN: {book.isbnNumber}</p>
      <div className="book-footer">
        <span className="book-price">${book.price.toFixed(2)}</span>
        <div className="book-actions">
          <button
            className="btn-icon btn-edit"
            onClick={handleEdit}
            title="Editar"
            disabled={isLoading}
          >
            Editar
          </button>
          <button
            className="btn-icon btn-delete"
            onClick={handleDelete}
            title="Eliminar"
            disabled={isLoading}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
