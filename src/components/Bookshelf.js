import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BookSearch.css'; 
import pagenotfound from '../assets/pagenotfound.jpeg'; 
import './Bookshelf.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Bookshelf = () => {
  const [bookshelf, setBookshelf] = useState([]);

  useEffect(() => {
    const storedBookshelf = localStorage.getItem('bookshelf');
    if (storedBookshelf) {
      setBookshelf(JSON.parse(storedBookshelf));
    }
  }, []);

  const removeFromBookshelf = (key, title) => {
    const updatedBookshelf = bookshelf.filter(book => book.key !== key);
    setBookshelf(updatedBookshelf);
    localStorage.setItem('bookshelf', JSON.stringify(updatedBookshelf));
    toast.error(`${title} removed from Bookshelf!`);
  };

  return (
    <>
      <header>
        <nav>
          <h1><Link to="/" className="bookshelf-link">Back to Search</Link></h1>
        </nav>
      </header>

      <div className="container">
        {bookshelf.length === 0 ? (
          <p>No books in your bookshelf. Add some books from the search page.</p>
        ) : (
          <div className="results-container">
            {bookshelf.map(book => (
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
                <h3>{book.title}</h3>
                <p>Author: {book.author_name ? book.author_name.join(', ') : 'Unknown'}</p>
                <button className='bookshelfbtn' onClick={() => removeFromBookshelf(book.key, book.title)}>Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>
      <ToastContainer 
      position='top-center'
      
      
      />
    </>
  );
};

export default Bookshelf;
