import React, { useEffect, useState } from 'react';
import StatsChart from '../components/StatsChart';
import TauxAcceptationChart from '../components/TauxAcceptationChart';
import ActiviteUtilisateursChart from '../components/ActiviteUtilisateursChart';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';

const DashboardStats = () => {
  console.log('DashboardStats rendu');
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    console.log('DashboardStats useEffect', user);
    axios.get(`${API_BASE_URL}/admin/stats`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(res => setStats(res.data))
    .catch(err => {
      setError(err.response?.data?.message || err.message);
      console.error(err);
    });
  }, []);

  if (error) return <div className="text-center text-red-600 mt-10">Erreur : {error}</div>;
  if (!stats) return <p className="text-center mt-10">Chargement des stats...</p>;

  let taux = stats.tauxAcceptation;
  if (typeof taux === 'string' && taux.endsWith('%')) taux = parseFloat(taux);
  const dataActivite = stats.utilisateursParMois || stats.utilisateursActifsParMois || [];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <strong>Utilisateur connecté :</strong> {user ? `${user.firstname} ${user.lastname} (${user.email})` : 'Non chargé'}
      </div>
      <h2 className="text-3xl font-bold text-center text-zellige">Tableau de bord</h2>
      <StatsChart stats={stats} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center text-lg">
        <div className="bg-sable p-4 rounded shadow">
          <p>Taux d'acceptation</p>
          <strong className="text-xl text-majorelle">{stats.tauxAcceptation}</strong>
        </div>
        <div className="bg-sable p-4 rounded shadow">
          <p>Utilisateurs actifs</p>
          <strong className="text-xl text-majorelle">{stats.utilisateursActifs}</strong>
        </div>
      </div>
      <TauxAcceptationChart taux={taux} />
      <ActiviteUtilisateursChart dataActivite={dataActivite} />
    </div>
  );
};

export default DashboardStats;
