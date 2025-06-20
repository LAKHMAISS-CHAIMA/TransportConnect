import React, { useEffect, useState } from 'react';
import StatsChart from '../components/StatsChart';
import TauxAcceptationChart from '../components/TauxAcceptationChart';
import ActiviteUtilisateursChart from '../components/ActiviteUtilisateursChart';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const DashboardStats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user && user.role === 'admin') {
      axios.get(`${API_BASE_URL}/admin/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
    }
  }, []);

  if (loading) return <p className="text-center mt-10">Chargement...</p>;
  if (!user || user.role !== 'admin') return <p className="text-center mt-10 text-red-500">Accès réservé à l'administrateur.</p>;
  if (!stats) return <p className="text-center mt-10">Chargement des stats...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
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
      <TauxAcceptationChart taux={stats.tauxAcceptation} />
      <ActiviteUtilisateursChart dataActivite={stats.utilisateursParMois} />
    </div>
  );
};

export default DashboardStats;
