const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./server'); // Adjust the path to point to your index file
const expect = chai.expect;
 
chai.use(chaiHttp);
 
describe('Book API Tests', () => {
  let createdBookId;
  
it('should get all books', (done) => {
    chai
      .request(app)
      .get('/library/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should get all Discarded books', (done) => {
    chai
      .request(app)
      .get('/library/books/discarded')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });
  

  describe("POST /library", () => {
    it("should add a new book", (done) => {
      chai
        .request(app)
        .post("/library")
        .send({
          title: "Test Book",
          author: "Test Author",
          genre: "Test Genre",
          yearPublished : 2023
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body)
            .to.have.property("message")
            .to.equal("Book created successfully");
          expect(res.body.data).to.have.property("title").to.equal("Test Book");
          done();
        });
    });
  });

  
// it('should create a new book', (done) => {
//     const NBook =  {
//                 "title": "CHAI TEST DONE",
//                 "author": "Sanket Aware",
//                 "genre":"DEMO",
//                 "yearPublished": 2023
//             }
 
//     chai
//       .request(app)
//       .post('/library/')
//       .send(NBook)
//       .end((err, res) => {
//         expect(res).to.have.status(201);
//         expect(res.body).to.be.an('object');
//         expect(res.body.message).to.equal(
//           `Book '${NBook.title}' by ${NBook.author} has been added.`
//         );
//         expect(res.body.createdBook).to.have.property('title', NBook.title);
//         expect(res.body.createdBook).to.have.property('author', NBook.author);
//         createdBookId = res.body.createdBook.id;
//         done();
//       });
//   });
 
 
  // Test GET /books/:id
  it('should get a specific book by ID', (done) => {
    chai
      .request(app)
      .get(`/library/${createdBookId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        // expect(res.body).to.have.property('id').equal(createdBookId);
        done();
      });
  });
 
  // Test PUT /books/:id
  it('should update a specific book by ID', (done) => {
    const updatedBook = {
      title: 'Updated CHAI Test Book',
    };
 
    chai
      .request(app)
      .put(`/library/${createdBookId}`)
      .send(updatedBook)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message').eql(`Book with ID '${createdBookId}' has been updated.`);
        expect(res.body).to.have.property('book');
        expect(res.body.book).to.have.property('title').eql('Updated Test Book');
        done();
      });
  });
 
  // Test DELETE /books/:id
  it('should delete a specific book by ID', (done) => {
    chai
      .request(app)
      .delete(`/library/${createdBookId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message').eql(`Book with ID '${createdBookId}' has been deleted.`);
        done();
      });
  });
});
 