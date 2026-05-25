import axios from 'axios';
import type { Book } from '../types/Book';

const API_BASE_URL = 'http://localhost:8080/api/books';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const bookService = {
  getAllBooks: async (): Promise<Book[]> => {
    const response = await api.get<Book[]>('');
    return response.data;
  },

  getBookById: async (id: number): Promise<Book | null> => {
    try {
      const response = await api.get<Book>(`/${id}`);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  createBook: async (book: Omit<Book, 'id'>): Promise<Book> => {
    const response = await api.post<Book>('', book);
    return response.data;
  },

  updateBook: async (id: number, book: Omit<Book, 'id'>): Promise<Book> => {
    const response = await api.put<Book>(`/${id}`, book);
    return response.data;
  },

  deleteBook: async (id: number): Promise<void> => {
    await api.delete(`/${id}`);
  },
};
