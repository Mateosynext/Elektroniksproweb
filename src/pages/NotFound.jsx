import React from 'react';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mt-2">Página no encontrada</p>
        <button
          onClick={() => window.history.back()}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
        >
          Volver atrás
        </button>
      </div>
    </div>
  );
};

export default NotFound;