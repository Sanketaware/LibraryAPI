const express = require('express');
const router = express.Router();
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./storage'); // Specify a directory for storage

const getAllBooks = (req, res) => {  // GET /library - Get all books
  let existingBooks = JSON.parse(localStorage.getItem('Books')) || [];
  
  if (existingBooks.length === 0) {
    return res.status(404).json({ error: 'Book shelf is empty.' });
  }

  res.status(200).json(existingBooks);
};

const getAllDiscardedBooks = (req, res) => {   //GET library/discarded - Get all discarded books
  let discardedBooks = JSON.parse(localStorage.getItem('DiscardedBooks')) || [];

  if (discardedBooks.length === 0) {
    return res.status(404).json({ error: 'Discarded book shelf is empty.' });
  }

  res.status(200).json(discardedBooks);
};

// GET /library/books/:id - Get a specific book by ID
const getBookById = (req, res) => {
  const bookId = req.params.id; // Extract the book ID from the request parameters
  let existingBooks = JSON.parse(localStorage.getItem('Books')) || [];
  const foundBook = existingBooks.find(book => book.id === bookId); // Find the book with the given ID
  if (!foundBook) {
      return res.status(404).json({ error: 'Book not found' });
  }
  res.status(200).json(foundBook);
};

const createBook = (req, res) => {   // POST /library - Create a new book
  const { title, author, genre, yearPublished } = req.body;
  if (!title || !author || !genre || !yearPublished) {
      return res.status(400).json({ error: 'Please provide all book details.' });
  }
  
  // Convert title, author, and genre to lowercase and remove white spaces
  const formattedTitle = title.toLowerCase().trim();
  const formattedAuthor = author.toLowerCase().trim();
  const formattedGenre = genre.toLowerCase().trim();
  
  let existingBooks = JSON.parse(localStorage.getItem('Books')) || [];
  let discardedBooks = JSON.parse(localStorage.getItem('DiscardedBooks')) || [];
  // Check if the book with the same details exists in 'Books' or 'DiscardedBooks'
  const bookExists = existingBooks.some(book =>
    book.title.toLowerCase().trim() === formattedTitle &&
    book.author.toLowerCase().trim() === formattedAuthor &&
    book.genre.toLowerCase().trim() === formattedGenre &&
    book.yearPublished === yearPublished
  );
  const discardedBookIndex = discardedBooks.findIndex(book =>
    book.title.toLowerCase().trim() === formattedTitle &&
    book.author.toLowerCase().trim() === formattedAuthor &&
    book.genre.toLowerCase().trim() === formattedGenre &&
    book.yearPublished === yearPublished
  );
  if (bookExists) {
      return res.status(400).json({ error: 'Book already exists in the main shelf.' });
  }
  if (discardedBookIndex !== -1) {
    const discardedBook = discardedBooks[discardedBookIndex];
    existingBooks.push(discardedBook); // Add book from discarded to main shelf
    discardedBooks.splice(discardedBookIndex, 1); // Remove book from discarded shelf
    localStorage.setItem('Books', JSON.stringify(existingBooks));
    localStorage.setItem('DiscardedBooks', JSON.stringify(discardedBooks));
    return res.status(201).json({ message: 'Book created successfully from discarded shelf', newBook: discardedBook });
  }
  let id = generateID(formattedGenre, yearPublished);
  const newBook = {
      id,
      title,
      author,
      genre,
      yearPublished
  };
  existingBooks.push(newBook);
  localStorage.setItem('Books', JSON.stringify(existingBooks));
  res.status(201).json({ message: 'Book created successfully', newBook });
};


// const createBook = (req, res) => {   // POST /library - Create a new book
//   const { title, author, genre, yearPublished } = req.body;
//   if (!title || !author || !genre || !yearPublished) {
//       return res.status(400).json({ error: 'Please provide all book details.' });
//   }
//   let existingBooks = JSON.parse(localStorage.getItem('Books')) || [];
//   let discardedBooks = JSON.parse(localStorage.getItem('DiscardedBooks')) || [];
//   // Check if the book with the same details exists in 'Books' or 'DiscardedBooks'
//   const bookExists = existingBooks.some(book =>
//     book.title === title &&
//     book.author === author &&
//     book.genre === genre &&
//     book.yearPublished === yearPublished
//   );
//   const discardedBookIndex = discardedBooks.findIndex(book =>
//     book.title === title &&
//     book.author === author &&
//     book.genre === genre &&
//     book.yearPublished === yearPublished
//   );
//   if (bookExists) {
//       return res.status(400).json({ error: 'Book already exists in the main shelf.' });
//   }
//   if (discardedBookIndex !== -1) {
//     const discardedBook = discardedBooks[discardedBookIndex];
//     existingBooks.push(discardedBook); // Add book from discarded to main shelf
//     discardedBooks.splice(discardedBookIndex, 1); // Remove book from discarded shelf
//     localStorage.setItem('Books', JSON.stringify(existingBooks));
//     localStorage.setItem('DiscardedBooks', JSON.stringify(discardedBooks));
//     return res.status(201).json({ message: 'Book created successfully from discarded shelf', newBook: discardedBook });
//   }
//   let id = generateID(genre, yearPublished);
//   const newBook = {
//       id,
//       title,
//       author,
//       genre,
//       yearPublished
//   };
//   existingBooks.push(newBook);
//   localStorage.setItem('Books', JSON.stringify(existingBooks));
//   res.status(201).json({ message: 'Book created successfully', newBook });
// };


// PUT /library/:id - Update a specific book by ID
const updateBookById = (req, res) => {
  const bookIdToUpdate = req.params.id; // Extract the book ID from the request parameters
  const { title, author, genre, yearPublished } = req.body; // Extract updated book details from the request body

  if (!title || !author || !genre || !yearPublished) {
      return res.status(400).json({ error: 'Please provide all updated book details.' });
  }
  let existingBooks = JSON.parse(localStorage.getItem('Books')) || [];
  let discardedBooks = JSON.parse(localStorage.getItem('DiscardedBooks')) || [];
  // Check if the book with the same details exists in 'Books' or 'DiscardedBooks'
  const bookExists = existingBooks.some(book =>
    book.title === title &&
    book.author === author &&
    book.genre === genre &&
    book.yearPublished === yearPublished
  );
  const discardedBookExists = discardedBooks.some(book =>
    book.title === title &&
    book.author === author &&
    book.genre === genre &&
    book.yearPublished === yearPublished
  );
  if (bookExists || discardedBookExists) {
      return res.status(400).json({ error: 'Book already exists, in either main shelf or discarded shelf.' });
  }
  // Find the index of the book with the given ID
  const bookIndex = existingBooks.findIndex(book => book.id === bookIdToUpdate);
  if (bookIndex === -1) {
      return res.status(404).json({ error: 'Book not found.' });
  }
  // Check if genre or yearPublished has changed
  const bookToUpdate = existingBooks[bookIndex];
  const isGenreUpdated = bookToUpdate.genre !== genre;
  const isYearPublishedUpdated = bookToUpdate.yearPublished !== yearPublished;
  // Update the book details
  existingBooks[bookIndex] = {
      ...existingBooks[bookIndex],
      title,
      author,
      genre,
      yearPublished
  };
  // If genre or yearPublished has changed, update the book ID
  if (isGenreUpdated || isYearPublishedUpdated) {
    const updatedBook = existingBooks[bookIndex];
    updatedBook.id = generateID(genre, yearPublished); // Generate new ID
    existingBooks[bookIndex] = updatedBook;
  }
  // Update the stored books after modification
  localStorage.setItem('Books', JSON.stringify(existingBooks));
  res.status(200).json({ message: 'Book updated successfully', updatedBook: existingBooks[bookIndex] });
};

const deleteBookById = (req, res) => {
  const bookIdToDelete = req.params.id;

  let existingBooks = JSON.parse(localStorage.getItem('Books')) || [];
  let discardedBooks = JSON.parse(localStorage.getItem('DiscardedBooks')) || [];

  // Filter out the book with the given ID
  const updatedBooks = existingBooks.filter(book => {
    if (book.id === bookIdToDelete) {
      discardedBooks.push(book); // Add deleted book to DiscardedBooks
      return false; // Exclude the book from updatedBooks
    }
    return true; // Include other books in updatedBooks
  });
  // Update the stored books after deletion and discarded books
  localStorage.setItem('Books', JSON.stringify(updatedBooks));
  localStorage.setItem('DiscardedBooks', JSON.stringify(discardedBooks));

  res.status(200).json({ message: 'Book deleted successfully' });
};


let totalbooks = parseInt(localStorage.getItem('TotalBooksCounter')) || 1;
const generateID = (genre, yearPublished) => {
  const genreCode = genre.substring(0, 2).toUpperCase();
  const yearCode = String(yearPublished).slice(-2);
  const id = `${genreCode}${totalbooks.toString().padStart(3, '0')}${yearCode}`;
  totalbooks++;
  localStorage.setItem('TotalBooksCounter', totalbooks.toString());
  return id;
};
module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBookById,
  deleteBookById,
  getAllDiscardedBooks
};
