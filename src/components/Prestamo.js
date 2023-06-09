import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import swal from 'sweetalert';

function Prestamo() {
  const auth = getAuth();
  const [loanedBooks, setLoanedBooks] = useState([]);
  const [returnedBooks, setReturnedBooks] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const fetchLoanedBooks = async () => {
      const firestore = getFirestore();
      const booksCollectionRef = collection(firestore, 'books');
      const userId = auth.currentUser.uid;
      const loanedBooksQuery = query(booksCollectionRef, where('loanedBy', '==', userId));
      const loanedBooksSnapshot = await getDocs(loanedBooksQuery);
      const loanedBooksData = loanedBooksSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLoanedBooks(loanedBooksData);
    };

    fetchLoanedBooks();
  }, [auth.currentUser]);

  const handleReturnBook = async (bookId) => {
    const firestore = getFirestore();
    const bookRef = doc(firestore, 'books', bookId);

    try {
      await updateDoc(bookRef, {
        loanedBy: '',
        availability: true,
      });

      const returnedBook = loanedBooks.find((book) => book.id === bookId);
      setReturnedBooks((prevReturnedBooks) => [...prevReturnedBooks, returnedBook]);

      setLoanedBooks((prevLoanedBooks) => prevLoanedBooks.filter((book) => book.id !== bookId));

      console.log('Libro devuelto con éxito');
      setShowSuccessMessage(true);
    } catch (error) {
      console.log('Error al devolver el libro:', error);
    }
  };

  useEffect(() => {
    if (showSuccessMessage) {
      swal({
        title: 'Libro devuelto con éxito',
        icon: 'success',
        timer: 3000,
      }).then(() => {
        setShowSuccessMessage(false);
      });
    }
  }, [showSuccessMessage]);

  return (
    <div className="container-sm w-50">
      <h2>Préstamo/Devolución</h2>

      {loanedBooks.length > 0 ? (
        <>
          <h3>Libros en préstamo:</h3>
          <ul className="list-group">
            {loanedBooks.map((book) => (
              <li key={book.id} className="list-group-item d-flex justify-content-between align-items-center">
                {book.title}
                <button className="btn btn-danger" onClick={() => handleReturnBook(book.id)}>
                  Devolver
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No tienes libros en préstamo.</p>
      )}

      {returnedBooks.length > 0 ? (
        <>
          <h3>Libros devueltos recientemente:</h3>
          <ul className="list-group">
            {returnedBooks.map((book) => (
              <li key={book.id} className="list-group-item">
                {book.title}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {showSuccessMessage && (
        <div className="alert alert-success" role="alert">
          Libro devuelto con éxito
        </div>
      )}
    </div>
  );
}

export default Prestamo;

