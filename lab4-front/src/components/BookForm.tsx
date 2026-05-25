import { useState, useEffect } from 'react';
import type { Book, BookType, BookFormData } from '../types/Book';

interface BookFormProps {
  book?: Book | null;
  onSubmit: (book: BookFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const BOOK_TYPES: BookType[] = ['EBOOK', 'SOFTCOVER', 'HARDCOVER'];

export function BookForm({ book, onSubmit, onCancel, isLoading = false }: BookFormProps) {
  const [formData, setFormData] = useState<BookFormData>({
    name: '',
    isbnNumber: '',
    author: '',
    publishDate: '',
    price: 0,
    type: 'SOFTCOVER',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (book) {
      setFormData({
        name: book.name,
        isbnNumber: book.isbnNumber,
        author: book.author,
        publishDate: book.publishDate,
        price: book.price,
        type: book.type,
      });
    }
  }, [book]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.isbnNumber.trim()) newErrors.isbnNumber = 'El ISBN es requerido';
    if (!formData.author.trim()) newErrors.author = 'El autor es requerido';
    if (!formData.publishDate) newErrors.publishDate = 'La fecha de publicación es requerida';
    if (formData.price <= 0) newErrors.price = 'El precio debe ser mayor a 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({
        name: '',
        isbnNumber: '',
        author: '',
        publishDate: '',
        price: 0,
        type: 'SOFTCOVER',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <h2>{book ? 'Editar Libro' : 'Crear Nuevo Libro'}</h2>

      <div className="form-group">
        <label htmlFor="name">Nombre del Libro *</label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ingrese el nombre del libro"
          disabled={isLoading}
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="isbnNumber">ISBN *</label>
        <input
          id="isbnNumber"
          type="text"
          name="isbnNumber"
          value={formData.isbnNumber}
          onChange={handleChange}
          placeholder="Ingrese el número ISBN"
          disabled={isLoading}
          className={errors.isbnNumber ? 'error' : ''}
        />
        {errors.isbnNumber && <span className="error-message">{errors.isbnNumber}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="author">Autor *</label>
        <input
          id="author"
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          placeholder="Ingrese el nombre del autor"
          disabled={isLoading}
          className={errors.author ? 'error' : ''}
        />
        {errors.author && <span className="error-message">{errors.author}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="publishDate">Fecha de Publicación *</label>
        <input
          id="publishDate"
          type="date"
          name="publishDate"
          value={formData.publishDate}
          onChange={handleChange}
          disabled={isLoading}
          className={errors.publishDate ? 'error' : ''}
        />
        {errors.publishDate && <span className="error-message">{errors.publishDate}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="price">Precio *</label>
        <input
          id="price"
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="0.00"
          disabled={isLoading}
          step="0.01"
          min="0"
          className={errors.price ? 'error' : ''}
        />
        {errors.price && <span className="error-message">{errors.price}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="type">Tipo de Libro *</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          disabled={isLoading}
        >
          {BOOK_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Cargando...' : book ? 'Actualizar' : 'Crear'}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
