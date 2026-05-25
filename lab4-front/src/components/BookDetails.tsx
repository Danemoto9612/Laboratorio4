import type { Book } from '../types/Book';

interface BookDetailsProps {
  book: Book | null;
  onClose: () => void;
  onEdit: (book: Book) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

export function BookDetails({ book, onClose, onEdit, onDelete, isLoading = false }: BookDetailsProps) {
  if (!book) return null;

  const handleDelete = () => {
    if (window.confirm(`¿Está seguro de que desea eliminar "${book.name}"?`)) {
      onDelete(book.id!);
      onClose();
    }
  };

  const publishDate = new Date(book.publishDate).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="book-details">
      <button className="btn-close" onClick={onClose} title="Cerrar">
        ✕
      </button>

      <div className="details-header">
        <h2>{book.name}</h2>
        <span className={`book-type-badge ${book.type.toLowerCase()}`}>
          {book.type}
        </span>
      </div>

      <div className="details-content">
        <div className="detail-group">
          <label>Autor</label>
          <p>{book.author}</p>
        </div>

        <div className="detail-group">
          <label>ISBN</label>
          <p className="isbn">{book.isbnNumber}</p>
        </div>

        <div className="detail-group">
          <label>Fecha de Publicación</label>
          <p>{publishDate}</p>
        </div>

        <div className="detail-group">
          <label>Precio</label>
          <p className="price">${book.price.toFixed(2)}</p>
        </div>
      </div>

      <div className="details-actions">
        <button
          className="btn btn-primary"
          onClick={() => onEdit(book)}
          disabled={isLoading}
        >
          Editar
        </button>
        <button
          className="btn btn-danger"
          onClick={handleDelete}
          disabled={isLoading}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
