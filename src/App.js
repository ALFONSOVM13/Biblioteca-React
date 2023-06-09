import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { FaFacebook, FaInstagram, FaTwitter, FaPhone } from 'react-icons/fa';

import Inicio from './components/Inicio';
import Filtro from './components/Filtro';
import Prestamo from './components/Prestamo';
import Admin from './components/Admin';
import Login from './components/Login';
import Register from './components/Register';

import { getFirestore, doc, getDoc } from 'firebase/firestore';

async function checkAdminRole(userId) {
  const firestore = getFirestore();
  const userDocRef = doc(firestore, 'users', userId);
  const userDocSnapshot = await getDoc(userDocRef);

  if (userDocSnapshot.exists()) {
    const userData = userDocSnapshot.data();
    return userData.isAdmin === true;
  }

  return false;
}

function App() {
  const [user, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const isAdmin = await checkAdminRole(currentUser.uid);
        setUser({ ...currentUser, admin: isAdmin });
        setUserEmail(currentUser.email); // Almacenar el correo electrónico del usuario
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      // Redirigir al usuario a la página de inicio
      return <Navigate to="/" />;
    } catch (error) {
      console.log(error);
    }
  };
  

  return (
    <Router>
      <div className="d-flex justify-content-between align-items-center p-4" style={{ fontSize: '20px' }}>
        <div className="d-flex align-items-center">
          <FaPhone className="mr-4" />
          <span>+123456789</span>
        </div>
        <img
          src="https://proyectotictac.files.wordpress.com/2020/05/imagen-destacada-biblioteca-grande-blog-proyectotictac-1.png"
          alt="Biblioteca CUC"
          style={{ height: '100px' }}
        />
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center"></div>
          <div className="d-flex">
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" style={{ marginRight: '15px' }}>
              <FaFacebook size={30} />
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" style={{ marginRight: '15px' }}>
              <FaInstagram size={30} />
            </a>
            <a href="https://www.twitter.com/" target="_blank" rel="noopener noreferrer">
              <FaTwitter size={30} />
            </a>
          </div>
        </div>
      </div>

      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav" className="d-flex justify-content-center">
          <Nav className="mr-auto">
            {user && (
              <>
                <Nav.Link as={Link} to="/">INICIO</Nav.Link>
                <Nav.Link as={Link} to="/filtro">BUSCAR LIBROS</Nav.Link>
                <Nav.Link as={Link} to="/prestamo">PRESTAMO</Nav.Link>
                {user.admin && (
                  <Nav.Link as={Link} to="/admin">GESTION DE LIBROS</Nav.Link>
                )}
              </>
            )}
          </Nav>
          <Nav>
            {user ? (
              <NavDropdown title={userEmail} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={handleLogout}>CERRAR SESION</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/">INICIO</Nav.Link>
                <Nav.Link as={Link} to="/login">INICIAR SESIÓN</Nav.Link>
                <Nav.Link as={Link} to="/register">REGISTRARSE</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div className="container ml-4">
        <Routes>
          {user ? (
            <>
              <Route path="/" element={<Inicio />} />
              <Route path="/filtro" element={<Filtro />} />
              <Route path="/prestamo" element={<Prestamo />} />
              {user.admin && <Route path="/admin" element={<Admin />} />}
              <Route path="/*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Inicio />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
        <hr />
        <footer className="text-center text-lg-start bg-light text-muted">
          <section>
            <div className="container p-4">
              <div className="row mt-3">
                <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                  <h6 className="text-uppercase fw-bold mb-4">Categorías</h6>
                  <p>
                    <a href="#!" className="text-reset">
                      Novelas
                    </a>
                  </p>
                  <p>
                    <a href="#!" className="text-reset">
                      Ciencia Ficción
                    </a>
                  </p>
                  <p>
                    <a href="#!" className="text-reset">
                      Historia
                    </a>
                  </p>
                </div>

                <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                  <h6 className="text-uppercase fw-bold mb-4">Servicios</h6>
                  <p>
                    <a href="#!" className="text-reset">
                      Préstamo de libros
                    </a>
                  </p>
                  <p>
                    <a href="#!" className="text-reset">
                      Reserva de salas de lectura
                    </a>
                  </p>
                  <p>
                    <a href="#!" className="text-reset">
                      Actividades culturales
                    </a>
                  </p>
                </div>

                <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mb-4">
                  <h6 className="text-uppercase fw-bold mb-4">Contáctenos</h6>
                  <p>
                    <i className="fas fa-home me-3"></i>  Calle 58 # 55 – 66
                  </p>
                  <p>
                    <i className="fas fa-envelope me-3"></i> info@biblioteca.com
                  </p>
                  <p>
                    <i className="fas fa-phone me-3"></i> +1 234 567 890
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="text-center p-2">
            © Derechos de Autor: DANIEL SALINAS
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;


