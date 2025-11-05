// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('authToken');
    const tokenExpiry = localStorage.getItem('tokenExpiry');

    // Verificar si el token existe y no ha expirado
    if (token && tokenExpiry) {
        const now = new Date().getTime();
        const expiry = parseInt(tokenExpiry);

        if (now < expiry) {
            return children;
        } else {
            // Token expirado, limpiar y redirigir
            localStorage.removeItem('authToken');
            localStorage.removeItem('tokenExpiry');
            localStorage.removeItem('userRole');
            localStorage.removeItem('username');
        }
    }

    // Redirigir al login si no está autenticado
    return <Navigate to="/login" replace />;
};

export default ProtectedRoute;