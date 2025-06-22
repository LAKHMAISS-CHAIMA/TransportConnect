import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DemandesRecues = () => {
  const [demandes, setDemandes] = useState([]);

  useEffect(() => {
    const fetchDemandes = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('/api/annonces/demandes-recues', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDemandes(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDemandes();
  }, []);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Demandes reçues</h2>
      <ul className="space-y-2">
        {demandes.map((d) => (
          <li key={d._id} className="p-4 bg-gray-100 rounded">
            <strong>{d.utilisateur.nom}</strong> a demandé une place pour {d.annonce.depart} ➜ {d.annonce.arrivee} le {d.annonce.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DemandesRecues;
