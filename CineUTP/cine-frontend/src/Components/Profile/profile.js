// src/Components/Profile/profile.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Context/logContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserProfileForm from './userInfo';
import Preferences from './preferences';
import PurchaseHistory from './history';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/users/profile', {
        headers: {
          'x-auth-token': token
        }
      });

      setUserInfo(response.data);
      setError('');
    } catch (err) {
      console.error('Error al obtener perfil:', err);
      setError('Error al cargar la información del perfil');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [navigate]);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                Mi Perfil
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'preferences' ? 'active' : ''}`}
                onClick={() => setActiveTab('preferences')}
              >
                Preferencias
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                Historial de Compras
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {activeTab === 'profile' && userInfo && (
            <UserProfileForm userData={userInfo} onUpdate={fetchUserInfo} />
          )}
          {activeTab === 'preferences' && userInfo && <Preferences userData={userInfo} onUpdate={fetchUserInfo} />}
          {activeTab === 'history' && <PurchaseHistory />}
        </div>
      </div>
    </div>
  );
};

export default Profile;