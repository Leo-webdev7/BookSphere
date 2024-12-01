import { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client'; // Import Apollo hooks
import { GET_ME } from '../apollo/queries.js';
import { REMOVE_BOOK } from '../apollo/mutations.js'; // Import the DELETE_BOOK mutation
import Auth from '../utils/auth.js';
import { removeBookId } from '../utils/localStorage';
import type { User } from '../models/User.js';

const SavedBooks = () => {
  const { data, loading, error } = useQuery(GET_ME); // Use Apollo's useQuery to get user data
  const [deleteBookMutation] = useMutation(REMOVE_BOOK); // Set up the mutation to delete a book
  const [savedBooks, setSavedBooks] = useState<User['savedBooks']>([]); // Use state for saved books

  // Handle data update when the GET_ME query returns
  useEffect(() => {
    if (data) {
      setSavedBooks(data.me.savedBooks); // Set saved books from fetched user data
    }
  }, [data]);

  // Handle book deletion
  const handleDeleteBook = async (bookId: string) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await deleteBookMutation({ 
        variables: { bookId },
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });

      // Update state with the new saved books list after deletion
      setSavedBooks(data.deleteBook.savedBooks); // Assuming the mutation returns updated saved books
      // Remove book ID from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle loading and error states
  if (loading) return <h2>LOADING...</h2>;
  if (error) return <h2>Error loading saved books: {error.message}</h2>;

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          {data?.me?.username ? (
            <h1>Viewing {data?.me?.username}'s saved books!</h1>
          ) : (
            <h1>Viewing saved books!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {savedBooks.length
            ? `Viewing ${savedBooks.length} saved ${
                savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {savedBooks.map((book) => {
            return (
              <Col md='4'>
                <Card key={book.bookId} border='dark'>
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant='top'
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className='btn-block btn-danger'
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
