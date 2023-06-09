import React, { useState } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from 'firebase/auth';
import { getFirestore, doc, setDoc} from 'firebase/firestore';
import { Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Register() {
  const [alertVariant, setAlertVariant] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    const firestore = getFirestore();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      // Verificar si el usuario ya está registrado
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        setAlertVariant('danger');
        setAlertMessage('Ya te encuentras registrado. Inicia sesión.');
        return;
      }

      // Crear el usuario y guardar sus datos en Firestore
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Asignar el rol correspondiente al usuario
      const defaultRole = 'user'; // Rol por defecto
      const roles = [defaultRole];
      const isAdmin = false; // Administrador por defecto

      const userData = { roles, isAdmin, uid: user.uid }; // Agregar el ID único del usuario

      await setDoc(doc(firestore, 'users', user.uid), userData);

      // Registro exitoso
      setAlertVariant('success');
      setAlertMessage('Registro exitoso');
      // Puedes realizar aquí acciones adicionales
    } catch (error) {
      // Manejo de errores
      console.log('Error en el registro:', error);
    }
  };

  return (
    <div className="container">
      <h2>Registro</h2>
      {alertMessage && <Alert variant={alertVariant}>{alertMessage}</Alert>}
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Correo electrónico
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Ingrese su correo electrónico"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Contraseña
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Ingrese su contraseña"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Registrarse
        </button>
      </form>
      <p>
        ¿Ya estás registrado? <Link to="/login">Inicia sesión</Link>.
      </p>
    </div>
  );
}

export default Register;
