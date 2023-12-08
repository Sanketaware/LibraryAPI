const express = require('express');
const router = express.Router();
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBookById,
  deleteBookById,
  getAllDiscardedBooks
} = require('./books_controller');

router.get('/', getAllBooks); // Calls getAllBooks for GET /library
router.get('/:id', getBookById); // Calls getBookById for GET /library/:id
router.post('/', createBook); // Calls createBook for POST /library
router.put('/:id', updateBookById); // Calls updateBookById for PUT /library/:id
router.delete('/:id', deleteBookById); // Calls deleteBookById for DELETE /library/:id
router.get('/books/discarded',getAllDiscardedBooks); //Call getAllDiscardedBooks for GET /library/delbooks
module.exports = router;

