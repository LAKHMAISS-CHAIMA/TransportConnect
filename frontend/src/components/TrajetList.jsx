import React from 'react';
import axios from 'axios';

const TrajetList = ({ trajets, refresh }) => {
  const envoyerDemande = async (annonceId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`/api/annonces/${annonceId}/demander`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Demande envoyée !');
      refresh(); 
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l’envoi de la demande');
    }
  };

  return (
    <div className="mt-6 space-y-4">
      {trajets.length === 0 ? (
        <p className="text-gray-600">Aucun trajet trouvé.</p>
      ) : (
        trajets.map((t) => (
          <div key={t._id} className="p-4 bg-gray-100 rounded shadow-sm flex justify-between items-center">
            <div>
              <p><strong>{t.depart}</strong> ➜ <strong>{t.arrivee}</strong></p>
              <p>Date : {t.date} | Prix : {t.prix}€ | Places : {t.places}</p>
            </div>
            <button onClick={() => envoyerDemande(t._id)} className="btn bg-green-600 text-white">Demander</button>
          </div>
        ))
      )}
    </div>
  );
};

export default TrajetList;
