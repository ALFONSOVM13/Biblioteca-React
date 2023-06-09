import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Row, Col, Button, Container } from 'react-bootstrap';
import Banner from './Banner';
import './Inicio.css';
import swal from 'sweetalert';

function Inicio() {
  const [availableBooks, setAvailableBooks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const firestore = getFirestore();

    const fetchAvailableBooks = async () => {
      const booksCollectionRef = collection(firestore, 'books');
      const availableBooksQuery = query(booksCollectionRef, where('availability', '==', true));
      const availableBooksSnapshot = await getDocs(availableBooksQuery);
      const availableBooksData = availableBooksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAvailableBooks(availableBooksData);
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    fetchAvailableBooks();

    // Cleanup function
    return () => {
      unsubscribe();
    };
  }, []);

  const handleLoanBook = async (bookId) => {
    if (currentUser) {
      const firestore = getFirestore();
      const bookRef = doc(firestore, 'books', bookId);
      await updateDoc(bookRef, { availability: false, loanedBy: currentUser.uid });
      console.log('Libro prestado:', bookId);
      setShowSuccessMessage(true);

      // Actualizar el estado de availableBooks después de prestar el libro
      setAvailableBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
    }
  };

  useEffect(() => {
    if (showSuccessMessage) {
      swal({
        title: 'Libro prestado con éxito',
        icon: 'success',
        timer: 3000,
      }).then(() => {
        setShowSuccessMessage(false);
      });
    }
  }, [showSuccessMessage]);

  return (
    <div>
      <div className="banner-container">
        <Banner />
      </div>


      <Container fluid>
        <h2>Libros Disponibles</h2>
        <Row xs={1} md={4} className="g-6">
          {availableBooks.map((book) => (
            <Col key={book.id}>
              <Card className="book-card">
                {book.imageUrl && <Card.Img variant="top" src={book.imageUrl} />}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">Autor: {book.author}</Card.Subtitle>
                  <Card.Text>Descripción: {book.description}</Card.Text>
                  <Card.Text>Disponibilidad: {book.availability ? 'Disponible' : 'No disponible'}</Card.Text>
                  <Card.Text>Año: {book.year}</Card.Text>
                  <div className="card-buttons">
                    {book.availability && currentUser && (
                      <Button onClick={() => handleLoanBook(book.id)} variant="primary">
                        PRESTAR LIBRO
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <hr />

        <div className="newsletter">
          <h3>Boletín de Noticias</h3>
          <p>¡Mantente al día con nuestras últimas novedades y eventos!</p>
          <form className="row g-3">
            <div className="col-auto">
              <input type="email" className="form-control" placeholder="Ingresa tu correo electrónico" />
            </div>
            <div className="col-auto">
              <button type="submit" className="btn btn-primary">
                Suscribirse
              </button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default Inicio





