// Add event listener to disable right-click on the entire document
document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });
  
  function handleClick(bookId) {
    // Handle the click for a specific book
    // This function needs to be defined based on what you want to happen when a book is clicked
    // For example, you could open a modal or perform some other action
    console.log(`Book ID clicked: ${bookId}`);
  }
  
  function showBookOptions(bookId) {
    // Show SweetAlert for edit and delete options
    Swal.fire({
      title: 'Book Options',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Edit',
      denyButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        Editbook(bookId);
        console.log(`Edit book with ID: ${bookId}`);
      } else if (result.isDenied) {
        deleteBook(bookId);
        console.log(`Delete book with ID: ${bookId}`);
      }
    });
  }