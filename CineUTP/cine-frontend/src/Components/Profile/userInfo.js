// src/Components/Profile/UserProfileForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../Context/logContext';

const UserProfileForm = ({ userData, onUpdate }) => {
  const { logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: userData.nombre || '',
    email: userData.email || '',
    telefono: userData.telefono || '',
  });

  useEffect(() => {
    setFormData({
      nombre: userData.nombre || '',
      email: userData.email || '',
      telefono: userData.telefono || '',
    });
  }, [userData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/users/profile',
        formData,
        {
          headers: { 'x-auth-token': token }
        }
      );
      await onUpdate(); // Esperar a que se actualice la información
      setIsEditing(false);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
      }
      console.error('Error al actualizar:', err);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title">{isEditing ? 'Editar Información' : 'Información Personal'}</h3>
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Teléfono</label>
              <input
                type="tel"
                className="form-control"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
              />
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                Guardar Cambios
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="mb-3">
              <strong>Nombre:</strong> {userData.nombre}
            </div>
            <div className="mb-3">
              <strong>Email:</strong> {userData.email}
            </div>
            <div className="mb-3">
              <strong>Teléfono:</strong> {userData.telefono || 'No especificado'}
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              Editar Información
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfileForm;