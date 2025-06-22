import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyAnnoncesList = () => {
  const [annonces, setAnnonces] = useState([]);

  useEffect(() => {
    const fetchAnnonces = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('/api/annonces/mes-annonces', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnnonces(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAnnonces();
  }, []);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Mes annonces</h2>
      <ul className="space-y-2">
        {annonces.map((a) => (
          <li key={a._id} className="p-4 bg-gray-100 rounded">
            {a.depart} ➜ {a.arrivee} | {a.date} | {a.places} places
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyAnnoncesList;
