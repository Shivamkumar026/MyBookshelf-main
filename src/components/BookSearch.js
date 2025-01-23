import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './BookSearch.css'; 
import pagenotfound from '../assets/pagenotfound.jpeg'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookSearch = () => {
  const [query, setQuery] = useState(localStorage.getItem('searchQuery') || '');
  const [searchInput, setSearchInput] = useState(query);
  const [results, setResults] = useState(JSON.parse(localStorage.getItem('searchResults')) || []);
  const [bookshelf, setBookshelf] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedBookshelf = localStorage.getItem('bookshelf');
    if (storedBookshelf) {
      setBookshelf(JSON.parse(storedBookshelf));
    }
  }, []);

  useEffect(() => {
    if (query.trim()) {
      setLoading(true);
      axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10&page=1`)
        .then(response => {
          const books = response.data.docs;
          if (books.length > 0) {
            setResults(books);
            setNoResults(false);
            localStorage.setItem('searchResults', JSON.stringify(books));
          } else {
            setResults([]);
            setNoResults(true);
            localStorage.removeItem('searchResults');
          }
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching data from Open Library API:", error);
          setResults([]);
          setNoResults(true);
          setLoading(false);
          localStorage.removeItem('searchResults');
        });
    } else {
      setResults([]);
      setNoResults(false);
      localStorage.removeItem('searchResults');
    }
  }, [query]);

  const addToBookshelf = (book) => {
    const updatedBookshelf = [...bookshelf, book];
    setBookshelf(updatedBookshelf);
    localStorage.setItem('bookshelf', JSON.stringify(updatedBookshelf));
    toast.success(`${book.title} added to Bookshelf!`);
  };

  const handleSearch = () => {
    setQuery(searchInput);
    localStorage.setItem('searchQuery', searchInput);
  };

  return (
    <>
      <header>
        <nav>
          <h1><Link to="/bookshelf" className="bookshelf-link">Go to My Bookshelf</Link></h1>
          <div className='form'> 
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for books..."
              className="search-input"
            />
            <button onClick={handleSearch} className="search-button" type='submit'>Search</button>
          </div>   
        </nav>
      </header>

      <div className="container">
        <div>
          {loading && 
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading...</p>
            </div>
          }
          {!loading && noResults && <p className="no-results">No books match your search criteria. Please try a different search term.</p>}
          {!loading && results.length === 0 && <p className="no-search">Search Your Favorite Books</p>}
          <div className="results-container">
            {results.map(book => (
              <div key={book.key} className="book-card">
                {book.cover_i ? (
                  <img 
                    src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`} 
                    alt={book.title} 
                    className="book-cover"
                  />
                ) : (
                  <img 
                    src={pagenotfound}
                    alt="No cover available" 
                    className="book-cover"
                  />
                )}
                <h4>{book.title}</h4>
                <p>Author: {book.author_name ? book.author_name.join(', ') : 'Unknown'}</p>
                <button className='booksearchbtn' onClick={() => addToBookshelf(book)}>Add to Bookshelf</button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ToastContainer position='top-center' />
    </>
  );
};

export default BookSearch;
