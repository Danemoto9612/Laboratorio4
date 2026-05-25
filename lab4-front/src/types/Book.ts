export type BookType = 'EBOOK' | 'SOFTCOVER' | 'HARDCOVER';

export interface Book {
  id?: number;
  name: string;
  isbnNumber: string;
  author: string;
  publishDate: string;
  price: number;
  type: BookType;
}

export interface BookFormData extends Omit<Book, 'id'> {}
