window.console = window.console || function(t) {};

if (document.location.search.match(/type=embed/gi)) {
    window.parent.postMessage("resize", "*");
  }

document.getElementById("fetchAllBooksBTN").addEventListener("click", getAllBooks);

function getAllBooks() {
  fetch("http://localhost:4000/library/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json(); // Parse the JSON response
      }
    })
    .then((data) => {
      const BooksTable = document.getElementById("bookList");
      const headingName = document.getElementById("headingname");
      let innerString = "";
      // Loop through the user data and add rows to the table
      data.forEach((book) => {
        innerString += `
          <tr oncontextmenu="showBookOptions('${book.id}');return false;">
          <td><a class="book-id-a">${book.id}</a></td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.genre}</td>
            <td>${book.yearPublished}</td>
          </tr>`;
      });
      BooksTable.innerHTML = innerString;
      headingName.textContent = "Available Books";
    })
    .catch((error) => {
      
      console.error('Error fetching book data:', error);
    });
}

document.getElementById("fetchAllDiscardedBooksBTN").addEventListener("click", getAllDiscardedBooks);

function getAllDiscardedBooks() {
  fetch("http://localhost:4000/library/books/discarded", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json(); 
      }
    })
    .then((data) => {
     
      const BooksTable = document.getElementById("bookList");
      const headingName = document.getElementById("headingname");
      let innerString = "";
      // Loop through the user data and add rows to the table
      data.forEach((book) => {
        innerString += `
          <tr>
            <td class="book-id-d">${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.genre}</td>
            <td>${book.yearPublished}</td>
          </tr>`;
      });
      BooksTable.innerHTML = innerString;
      headingName.textContent = "Discarded Books";
     
    })
    .catch((error) => {
      
      console.error('Error fetching book data:', error.data);
    });
}

function deleteBook(bookId) {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Once deleted, you will not be able to recover this book!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`http://localhost:4000/library/${bookId}`, {
        method: 'DELETE'
      })
      .then(response => response.json())
      .then(result => {
        console.log('Deleted Book:', result);
        Swal.fire('Deleted!', 'Your book has been deleted.', 'success');
        // Refresh the table after deletion
        getAllBooks();
        getAllDiscardedBooks();
      })
      .catch(error => console.error('Error deleting book:', error));
    }
  });
}


// JavaScript to ADD a book along with the SweetAlert

AddBookBTN.addEventListener('click', function() {
  Swal.fire({
    title: 'Add Book',
    html: `
      <form class="bookForm" id="bookForm">
        <input type="text" placeholder="Title" id="title" class="swal2-input" required>
        <input type="text" placeholder="Author" id="author" class="swal2-input" required>
        <input type="text" placeholder="Genre" id="genre" class="swal2-input" required>
        <input type="number" placeholder="Year" id="yearPublished" class="swal2-input" required>
      </form>
    `,
    showCancelButton: true,
    confirmButtonText: 'Add',
    focusConfirm: false,
    preConfirm: () => {
      const title = document.getElementById('title').value;
      const author = document.getElementById('author').value;
      const genre = document.getElementById('genre').value;
      const yearPublished = document.getElementById('yearPublished').value;

      // Validate all fields are filled
      if (!title || !author || !genre || !yearPublished) {
        Swal.showValidationMessage('Please fill in all fields');
        return false;
      }

      // Use Fetch API to send data to server
      return fetch('http://localhost:4000/library/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          author,
          genre,
          yearPublished
        })
      })
      .then(response => {
        // if (!response.ok) {
        //   throw new Error('Network response was not ok.');
        // }
        return response.json();
      })
      .then(data => {
        // Handle successful response from the API
        if(data.message != null)
        {
          console.log('Book added:', data);
          Swal.fire('Book Added',data.message, 'success');
          getAllBooks(); 
        }else{
          console.error('Error adding book:', data.error);
          Swal.fire('Error',data.error, 'error');
        }
      })
    }
  });
});


/////////////////////////////


/////////////////////////////
// Function to open the edit modal
async function Editbook(bookID) {
  try {
    const book = await getBookById(bookID);
    const { value: formValues } = await Swal.fire({
      title: 'Edit Book',
      html: `
        <form id="editBookForm">
          <input type="text" id="editTitle" class="swal2-input" value="${book.title}">
          <input type="text" id="editAuthor" class="swal2-input" value="${book.author}">
          <input type="text" id="editGenre" class="swal2-input" value="${book.genre}">
          <input type="text" id="editYearPublished" class="swal2-input" value="${book.yearPublished}">
        </form>
      `,
      showCancelButton: true,
      confirmButtonText: 'Update',
      focusConfirm: false,
      preConfirm: async () => {
        const editedTitle = document.getElementById('editTitle').value;
        const editedAuthor = document.getElementById('editAuthor').value;
        const editedGenre = document.getElementById('editGenre').value;
        const editedYearPublished = document.getElementById('editYearPublished').value;

        try {
          const response = await fetch(`http://localhost:4000/library/${bookID}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: editedTitle,
              author: editedAuthor,
              genre: editedGenre,
              yearPublished: editedYearPublished
            })
          });

          if (!response.ok) {
            throw new Error('Network response was not ok.');
          }

          const data = await response.json();
          console.log('Book updated:', data);
          Swal.fire('Book Updated', 'Book has been successfully updated.', 'success');
          getAllBooks(); // Refresh the table after update
        } catch (error) {
          console.error('Error updating book:', error);
          Swal.fire('Error', 'There was an error updating the book.', 'error');
        }
      }
    });

    if (formValues) {
      // Handle form values if needed
    }
  } catch (error) {
    console.error('Error editing book:', error);
    // Handle the error here (e.g., show an error message)
  }
}

async function getBookById(ID) {
  try {
    const response = await fetch(`http://localhost:4000/library/${ID}`, {
      method: 'GET'
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to fetch book data');
  }
}

