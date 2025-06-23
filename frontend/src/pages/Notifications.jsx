import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const getIconForType = (type) => {
  switch (type) {
    case 'request':
      return '📄'; 
    case 'approval':
      return '✅'; 
    case 'admin':
      return '📢'; 
    default:
      return '🔔';
  }
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDemande, setSelectedDemande] = useState(null);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/notifications?populate=demande');
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError('Erreur lors du chargement des notifications.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      setNotifications(
        notifications.map(n => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Erreur pour marquer comme lue:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/notifications/${id}`);
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (err) {
      console.error("Erreur de suppression:", err);
    }
  };

  const handleShowDetails = (demande) => {
    if (demande) {
      setSelectedDemande(demande);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#fdf6e3] p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 p-6 bg-[#2a6f97] rounded-2xl shadow-lg text-white flex items-center gap-4">
          <span className="text-4xl">🔔</span>
          <div>
            <h1 className="text-4xl font-bold font-serif">Notifications</h1>
            <p className="mt-2 text-blue-200">Restez à jour sur l'activité de votre compte.</p>
          </div>
        </div>

        {loading ? (
          <p>Chargement...</p>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg">
            <ul className="divide-y divide-gray-200">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <li
                    key={notif._id}
                    className={`p-4 flex justify-between items-center transition-colors duration-300 ${!notif.read ? 'bg-[#e0f2fe]' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl mt-1">{getIconForType(notif.type)}</span>
                      <div className="flex-grow">
                        <p className={`font-medium ${!notif.read && 'font-bold'} flex items-center gap-2`}>
                          {notif.type === 'approval' && <span className="inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-semibold">Validée</span>}
                          {notif.type === 'request' && <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-semibold">Demande</span>}
                          {notif.type === 'admin' && <span className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold">Admin</span>}
                          {notif.message}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: fr })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {notif.demande && (
                        <button 
                          onClick={() => handleShowDetails(notif.demande)} 
                          className="text-sm bg-[#2a6f97] text-white px-3 py-1 rounded-md hover:bg-opacity-90 shadow"
                        >
                          Détails
                        </button>
                      )}
                      {!notif.read && (
                        <button onClick={() => handleMarkAsRead(notif._id)} className="text-sm text-blue-600 hover:underline">Marquer comme lue</button>
                      )}
                      <button
                        onClick={() => handleDelete(notif._id)}
                        className="text-gray-400 hover:text-[#c1272d] transition-colors text-xl font-bold"
                        title="Supprimer"
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <p className="p-6 text-center text-gray-500">Vous n'avez aucune notification.</p>
              )}
            </ul>
          </div>
        )}
      </div>

      {selectedDemande && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative">
            <button onClick={() => setSelectedDemande(null)} className="absolute top-4 right-4 text-2xl font-bold text-gray-500 hover:text-gray-800">&times;</button>
            <h3 className="text-2xl font-bold mb-4 text-[#2a6f97]">Détails</h3>
            <div className="space-y-4 text-gray-700">
              <div>
                  <h4 className="font-bold text-lg text-gray-800 mb-2 border-b pb-1">Détails de la demande</h4>
                  <p><strong>Type de colis:</strong> {selectedDemande.typeColis || 'N/A'}</p>
                  <p><strong>Dimensions:</strong> {selectedDemande.dimensions || 'N/A'}</p>
                  <p><strong>Poids:</strong> {selectedDemande.poids ? `${selectedDemande.poids} kg` : 'N/A'}</p>
                  <p><strong>Description:</strong> {selectedDemande.description || 'N/A'}</p>
              </div>

              {selectedDemande.annonce && (
                  <div>
                      <h4 className="font-bold text-lg text-gray-800 mb-2 border-b pb-1">Annonce concernée</h4>
                      <p><strong>Trajet:</strong> {selectedDemande.annonce.depart} → {selectedDemande.annonce.destination}</p>
                      <p><strong>Date:</strong> {new Date(selectedDemande.annonce.dateTrajet).toLocaleDateString()}</p>
                      <p><strong>Prix proposé:</strong> {selectedDemande.annonce.prix} DH</p>
                  </div>
              )}
              
              <hr />

              <p><strong>Statut:</strong> <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                selectedDemande.statut === 'acceptée' ? 'bg-green-100 text-green-800' : 
                selectedDemande.statut === 'refusée' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
              }`}>{selectedDemande.statut}</span></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 