// components/Navigation.jsx
import { Heading1, HeartCrackIcon, ReceiptJapaneseYen } from 'lucide-react';
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="bg-card border-b border-border p-4">
      <div className="flex space-x-4">
        <Link 
          to="/inventory" 
          className={`px-3 py-2 rounded ${
            location.pathname === '/inventory' ? 'bg-primary text-white' : 'text-card-foreground'
          }`}
        >
          Inventario
        </Link>
        
        <Link 
          to="/work-orders" 
          className={`px-3 py-2 rounded ${
            location.pathname === '/work-orders' ? 'bg-primary text-white' : 'text-card-foreground'
          }`}
        >
          Órdenes
        </Link>
        
        {userRole === 'director' && (
          <Link 
            to="/financial" 
            className={`px-3 py-2 rounded ${
              location.pathname === '/financial' ? 'bg-primary text-white' : 'text-card-foreground'
            }`}
          >
            Finanzas
          </Link>
        )}
        
        <button 
          onClick={handleLogout}
          className="px-3 py-2 text-error ml-auto"
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};

export default Navigation; 