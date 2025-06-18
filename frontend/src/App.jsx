import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-blue-600 mb-4">TransportConnect</h1>
                  <p className="text-lg text-gray-600">Plateforme de logistique du transport de marchandises</p>
                  <div className="mt-8">
                    <p className="text-sm text-gray-500">Application en cours de développement</p>
                  </div>
                </div>
              } />
            </Routes>
          </main>
          <ToastContainer position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
