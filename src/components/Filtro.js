import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';

function Filtro() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const firestore = getFirestore();
      const booksCollection = collection(firestore, 'books');
      const booksSnapshot = await getDocs(booksCollection);
      const booksData = booksSnapshot.docs.map((doc) => doc.data());
      setBooks(booksData);
      setFilteredBooks(booksData);
    } catch (error) {
      console.log('Error fetching books:', error);
    }
  };

  const handleSearch = () => {
    const filtered = books.filter((book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBooks(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [searchQuery, handleSearch]);

  return (
    <div className="container">
      <h2>Buscar Libros</h2>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Buscar por título"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
      />

      {filteredBooks.length > 0 ? (
        <div>
          <h3>Resultados de búsqueda:</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Autor</th>
                <th>Disponibilidad</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book, index) => (
                <tr key={index}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.availability ? 'Disponible' : 'No disponible'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No se encontraron resultados</p>
      )}
    </div>
  );
}

export default Filtro;



