import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import ConducteurDashboard from "./pages/ConducteurDashboard";
import ExpediteurDashboard from "./pages/ExpediteurDashboard";
import AnnonceSearch from "./pages/AnnonceSearch";
import CreateAnnonce from "./pages/CreateAnnonce";
import Notifications from "./pages/Notifications";
import HistoriqueTrajets from "./pages/HistoriqueTrajets";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import { Toaster } from 'react-hot-toast';

function PrivateRoute({ children, allowedRoles }) {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return <div className="text-center mt-10">Chargement...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/dashboard" />;
  return children;
}

function AppRoutes() {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);
  const { user } = useAuth();

  const getDashboard = () => {
    if (!user) return <div>Chargement...</div>;
    if (user.role === "admin") return <AdminDashboard />;
    if (user.role === "conducteur") return <ConducteurDashboard />;
    if (user.role === "expediteur") return <ExpediteurDashboard />;
    return <div>Rôle inconnu</div>;
  };

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute>{getDashboard()}</PrivateRoute>} />
        <Route path="/annonces" element={<PrivateRoute allowedRoles={["expediteur"]}><AnnonceSearch /></PrivateRoute>} />
        <Route path="/annonce/create" element={<PrivateRoute allowedRoles={["conducteur"]}><CreateAnnonce /></PrivateRoute>} />
        <Route path="/historique" element={<PrivateRoute><HistoriqueTrajets /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
