# Library Management API

## Overview
This project implements a simple library management system, providing a Book API with several endpoints for specific operations.

### Endpoints
1. Retrieve all Books
2. Retrieve all Recycled Books
3. Get specific Book
4. Add Book
5. Edit/Update Book
6. Delete Book

## Usage Conventions

### Status Codes
- **2XX**: Success of some kind
- **4XX**: Error occurred in client’s part
- **5XX**: Error occurred in server’s part

### Methods
1. **Retrieve Books**
   - Retrieve all the books from the server.
   - **Request Method**: GET
   - **URL**: {{BaseUrl}}/Books/
   - **Response**:
     - 200: Response will be an object containing the list of books (array).
     - 400: {"error":"Bad Request."}
     - 500: {"error":"Something went wrong. Please try again later."}
     - 503: {"error":"Empty Shelf."}

2. **Retrieve Recycled Books**
   - Retrieve all books from the Recycled section of the server.
   - **Request Method**: GET
   - **URL**: {{BaseUrl}}/RecycledBooks/
   - **Response**:
     - 200: Response will be an object containing the list of books from the Recycled Array.
     - 400: {"error":"Bad Request."}
     - 500: {"error":"Something went wrong. Please try again later."}
     - 503: {"error":"Empty Shelf."}

3. **Get specific book**
   - Fetch the single required book.
   - **Request Method**: GET
   - **URL**: {{BaseUrl}}/books/:id
   - **Response**:
     - 200: Response will be an object containing the specific book.
     - 400: {"error":"Bad Request."}
     - 404: {"error":"Book Not Found."}
     - 500: {"error":"Something went wrong. Please try again later."}

4. **Add a book**
   - Add a new book to the server database.
   - **Request Method**: POST
   - **URL**: {{BaseUrl}}/books/
   - **Request Body**: JSON
   - **Response**:
     - 200: {"message": "Successfully Added, but also already exists in recycle bin"}
     - 201: {"message": "Successfully Added"}
     - 400: {"error":"Bad Request."}
     - 500: {"error":"Something went wrong. Please try again later."}
     - 503: {"error":"Book already exists."}

5. **Edit/Update a book**
   - Get more information on a particular recipe.
   - **Request Method**: PUT
   - **URL**: {{BaseUrl}}/books/:{id}
   - **Request Body**: JSON
   - **Response**:
     - 200: {"message": "OK"}
     - 400: {"error":"Bad Request."}
     - 404: {"error":"Book Not Found."}
     - 500: {"error":"Something went wrong. Please try again later."}

6. **Delete a specific book**
   - Delete the specified book from the Main Books Array and add it to the Junk Array which will be cleared after 30 days.
   - **Request Method**: DELETE
   - **URL**: {{BaseUrl}}/books/:{id}
   - **Response**:
     - 200: {"message": "DELETED"}
     - 400: {"error":"Bad Request"}
     - 404: {"error": "Book Not Found"}
     - 500: {"error":"Something went wrong. Please try again later."}

## Glossary

### Conventions
- **Client**: Client application. [POSTMAN for Mock Server testing]
- **Status**: HTTP status code of response.
- All the possible responses are listed under ‘Responses’ for each method. Only one of them is issued per request server.
- All responses are in JSON format.
- All request parameters are mandatory unless explicitly marked as [optional].

### Standard HTTP status codes
- **2XX**: Success of some kind
- **4XX**: Error occurred in client’s part
- **5XX**: Error occurred in server’s part

### Status Code Descriptions
- 200: OK
- 201: Created
- 202: Accepted (Request accepted and queued for execution)
- 400: Bad request
- 404: Resource not found
- 500: Internal Server Error
- 503: Service Unavailable
