import React, { useEffect, useState } from "react";
import axios from "axios";
import AnnonceTable from "../components/AnnonceTable";
import UserTable from "../components/UserTable";
import DashboardStats from "../components/DashboardStats";
import ActivityChart from "../components/ActivityChart";
import DemandeTable from "../components/DemandeTable";

const API_URL = "/api/admin";

const roles = {
  admin: "Administrateur",
  conducteur: "Chauffeur",
  expediteur: "Expéditeur"
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, annonces: 0, demandes: 0 });
  const [users, setUsers] = useState([]);
  const [annonces, setAnnonces] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [usersByMonth, setUsersByMonth] = useState([]);
  const [annoncesByMonth, setAnnoncesByMonth] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ type: '', data: [] });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, usersRes, annoncesRes, demandesRes, graphRes] = await Promise.all([
          axios.get("/api/admin/stats"),
          axios.get("/api/admin/users"),
          axios.get("/api/admin/annonces"),
          axios.get("/api/admin/demandes"),
          axios.get("/api/admin/stats/graph"),
        ]);
        
        setStats(statsRes.data);
        setUsers(usersRes.data);
        setAnnonces(annoncesRes.data);
        setDemandes(demandesRes.data);
        setUsersByMonth(graphRes.data.usersByMonth);
        setAnnoncesByMonth(graphRes.data.annoncesByMonth);
        
        setError("");
      } catch (err) {
        setError("Erreur lors de la récupération des données administrateur.");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleCardClick = (type) => {
    let content = { type: '', data: [] };
    if (type === 'users') {
      content = { type: 'Utilisateurs', data: users };
    } else if (type === 'annonces') {
      content = { type: 'Annonces', data: annonces };
    } else if (type === 'demandes') {
      content = { type: 'Demandes', data: demandes };
    } else {
      return; 
    }
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;
    try {
      await axios.delete(`${API_URL}/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
      setError("");
    } catch {
      setError("Impossible de supprimer l'utilisateur. Réessayez plus tard !");
    }
  };

  const handleChangeRole = async (id, currentRole) => {
    const newRole = currentRole === "conducteur" ? "expediteur" : "conducteur";
    try {
      await axios.put(`${API_URL}/users/${id}`, { role: newRole });
      setUsers(users.map((u) => (u._id === id ? { ...u, role: newRole } : u)));
      setError("");
    } catch {
      setError("Impossible de changer le rôle. Réessayez plus tard !");
    }
  };

  const handleDeleteAnnonce = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette annonce ?")) return;
    try {
      await axios.delete(`${API_URL}/annonces/${id}`);
      setAnnonces(annonces.filter((a) => a._id !== id));
      setError("");
    } catch {
      setError("Impossible de supprimer l'annonce. Réessayez plus tard !");
    }
  };

  if (loading) return <div className="text-center p-8">Chargement des données...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-[#fdf6e3] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 p-6 bg-[#2a6f97] rounded-2xl shadow-lg text-white">
          <h1 className="text-4xl font-bold font-serif">Tableau de Bord Administrateur</h1>
          <p className="mt-2 text-blue-200">Vue d'ensemble de l'activité de la plateforme.</p>
        </div>

        <DashboardStats stats={stats} onCardClick={handleCardClick} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-[#007a33]">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Nouveaux Utilisateurs</h3>
            <ActivityChart 
              data={usersByMonth}
              title="Utilisateurs par mois"
              color="#007a33" 
            />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-[#c1272d]">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Nouvelles Annonces</h3>
            <ActivityChart 
              data={annoncesByMonth}
              title="Annonces par mois"
              color="#c1272d" 
            />
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Gestion des Utilisateurs</h3>
            <UserTable users={users} handleDelete={handleDeleteUser} />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Gestion des Annonces</h3>
            <AnnonceTable annonces={annonces} handleDelete={handleDeleteAnnonce} />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-4 pb-4 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">{modalContent.type}</h2>
                    <button onClick={closeModal} className="text-gray-500 hover:text-gray-800 text-3xl font-bold">&times;</button>
                </div>
                <div className="overflow-y-auto">
                    {modalContent.type === 'Utilisateurs' && <UserTable users={modalContent.data} />}
                    {modalContent.type === 'Annonces' && <AnnonceTable annonces={modalContent.data} handleDelete={handleDeleteAnnonce} />}
                    {modalContent.type === 'Demandes' && <DemandeTable demandes={modalContent.data} />}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
