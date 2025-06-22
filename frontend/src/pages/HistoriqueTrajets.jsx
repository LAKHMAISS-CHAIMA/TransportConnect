import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Geolocalisation from '../components/Geolocalisation';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function HistoriqueTrajets() {
  const [trajets, setTrajets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTrajet, setSelectedTrajet] = useState(null);
  const [filter, setFilter] = useState('all'); 
  const { user } = useAuth();

  useEffect(() => {
    const fetchTrajets = async () => {
      try {
        let res;
        if (user.role === 'conducteur') {
          res = await axios.get('/api/annonces/conducteur/me'); 
        } else {
          res = await axios.get('/api/demandes/mes-demandes'); 
        }
        const allData = (Array.isArray(res.data) ? res.data : [])
          .map(item => item.annonce ? ({...item.annonce, statut_demande: item.statut}) : item) 
          .filter(item => user.role === 'expediteur' ? item.statut_demande === 'acceptée' : true); 

        setTrajets(allData);
        if (allData.length > 0) {
          setSelectedTrajet(allData[0]);
        }
      } catch (err) {
        setError("Impossible de charger l'historique.");
      }
      setLoading(false);
    };

    if(user?._id) fetchTrajets();
  }, [user]);

  const filteredTrajets = trajets.filter(trajet => {
    if (filter === 'completed') return new Date(trajet.dateTrajet) < new Date();
    if (filter === 'ongoing') return new Date(trajet.dateTrajet) >= new Date();
    return true;
  });

  if (loading) return <div className="text-center p-8">Chargement...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-[#fdf6e3] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 p-6 bg-[#2a6f97] rounded-2xl shadow-lg text-white">
          <h1 className="text-4xl font-bold font-serif">Historique des Trajets</h1>
          <p className="mt-2 text-blue-200">Consultez vos trajets passés et à venir.</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-[#c1272d] text-white' : 'bg-white'}`}>Tous</button>
          <button onClick={() => setFilter('completed')} className={`px-4 py-2 rounded-lg ${filter === 'completed' ? 'bg-[#c1272d] text-white' : 'bg-white'}`}>Terminés</button>
          <button onClick={() => setFilter('ongoing')} className={`px-4 py-2 rounded-lg ${filter === 'ongoing' ? 'bg-[#c1272d] text-white' : 'bg-white'}`}>À venir</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 bg-white p-4 rounded-xl shadow-lg h-full overflow-y-auto" style={{maxHeight: '70vh'}}>
            {filteredTrajets.length > 0 ? filteredTrajets.map(t => (
              <div key={t._id} onClick={() => setSelectedTrajet(t)} className={`p-4 rounded-lg cursor-pointer mb-2 ${selectedTrajet?._id === t._id ? 'bg-[#e9e1d5]' : 'hover:bg-gray-100'}`}>
                <h3 className="font-bold">{t.depart} → {t.destination}</h3>
                <p className="text-sm text-gray-600">{new Date(t.dateTrajet).toLocaleDateString()}</p>
              </div>
            )) : <p>Aucun trajet trouvé.</p>}
          </div>

          <div className="md:col-span-2">
            {selectedTrajet ? (
              <Geolocalisation 
                depart={selectedTrajet.depart} 
                destination={selectedTrajet.destination} 
                isActive={new Date(selectedTrajet.dateTrajet).toDateString() === new Date().toDateString()}
              />
            ) : (
              <div className="bg-white p-8 rounded-xl shadow-lg text-center h-full flex items-center justify-center">
                <p className="text-gray-500">Sélectionnez un trajet pour voir la carte et les détails.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 