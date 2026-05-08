package com.tdea.librotdea.service;

import com.tdea.librotdea.entity.Book;
import com.tdea.librotdea.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    @Autowired
    private BookRepository repository;

    public Book save(Book book) {
        return repository.save(book);
    }

    public List<Book> findAll() {
        return repository.findAll();
    }

    public Optional<Book> findById(Long id) {
        return repository.findById(id);
    }

    public Book update(Long id, Book newB) {
        newB.setId(id);
        return repository.save(newB);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
