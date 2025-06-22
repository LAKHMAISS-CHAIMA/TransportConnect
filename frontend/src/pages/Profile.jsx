import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaUserEdit, FaShieldAlt, FaStar, FaBox, FaRoute, FaPaperPlane } from 'react-icons/fa';

const StaticStarRating = ({ rating }) => {
  const totalStars = 5;
  let stars = [];
  for (let i = 1; i <= totalStars; i++) {
    stars.push(
      <span key={i} className={`text-3xl ${i <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    );
  }
  return <div className="flex">{stars}</div>;
};

const StatCard = ({ icon, label, value }) => (
  <div className="bg-[#e9e1d5] p-4 rounded-lg flex items-center gap-4 shadow-sm">
    <div className="text-2xl text-[#c1272d]">{icon}</div>
    <div>
      <p className="font-bold text-xl text-gray-800">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  </div>
);

export default function Profile() {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [evaluations, setEvaluations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email, password: '' });
      
      const fetchData = async () => {
        setLoading(true);
        try {
          const [evalRes, statsRes] = await Promise.all([
            axios.get(`/api/evaluations/utilisateur/${user._id}`),
            axios.get('/api/users/profile/stats')
          ]);
          setEvaluations(Array.isArray(evalRes.data) ? evalRes.data : []);
          setStats(statsRes.data);
        } catch (err) {
          console.error("Erreur chargement données profil:", err);
          setError("Impossible de charger toutes les données du profil.");
        }
        setLoading(false);
      };

      fetchData();
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    const updates = { name: formData.name };
    if (formData.password) {
      updates.password = formData.password;
    }
    
    try {
      const res = await axios.put('/api/users/profile', updates);
      setUser(res.data.user); 
      setMessage('Profil mis à jour avec succès !');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour.');
    }
  };

  if (loading || !user) {
    return <div className="text-center mt-10">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-[#fdf6e3] p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 p-6 bg-[#2a6f97] rounded-2xl shadow-lg text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold font-serif">Mon Profil</h1>
              <p className="mt-2 text-blue-200">Gérez vos informations personnelles et visualisez vos évaluations.</p>
            </div>
            <div className="text-right">
              <span className="text-sm bg-white/20 text-white font-semibold py-1 px-3 rounded-full">{user.role}</span>
            </div>
          </div>
        </div>

        {message && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{message}</div>}
        {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3"><FaUserEdit /> Mes Informations</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-medium">Nom</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border p-2 rounded w-full mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium">Email (non modifiable)</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    className="border p-2 rounded w-full mt-1 bg-gray-100"
                    disabled
                  />
                </div>
                <div>
                  <label className="block font-medium">Nouveau mot de passe (laisser vide pour ne pas changer)</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="border p-2 rounded w-full mt-1"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 bg-[#c1272d] hover:bg-opacity-90 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-transform duration-200 hover:scale-105"
                >
                  {loading ? 'Mise à jour...' : 'Mettre à jour le profil'}
                </button>
              </form>
            </div>

            {stats && (
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Mon Activité</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.role === 'conducteur' && (
                    <>
                      <StatCard icon={<FaBox />} label="Annonces créées" value={stats.annonces ?? 0} />
                      <StatCard icon={<FaRoute />} label="Trajets réalisés" value={stats.trajets ?? 0} />
                    </>
                  )}
                  {user.role === 'expediteur' && (
                    <>
                      <StatCard icon={<FaPaperPlane />} label="Demandes envoyées" value={stats.demandes ?? 0} />
                      <StatCard icon={<FaRoute />} label="Trajets effectués" value={stats.trajets ?? 0} />
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1 bg-white p-8 rounded-xl shadow-lg">
             <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3"><FaStar /> Mes Évaluations</h2>
             <div className="flex items-center gap-4 mb-6">
               <span className="font-bold text-lg">Note moyenne :</span>
               <StaticStarRating rating={user.noteMoyenne || 0} />
               <span className="text-lg font-bold text-gray-700">({(user.noteMoyenne || 0).toFixed(1)} / 5)</span>
             </div>

             <div className="space-y-4">
               {evaluations.length > 0 ? (
                 evaluations.map(ev => (
                   <div key={ev._id} className="border-b pb-4">
                     <div className="flex justify-between items-center">
                       <span className="font-bold">{ev.evaluateur.firstname || ev.evaluateur.name}</span>
                       <StaticStarRating rating={ev.note} />
                     </div>
                     <p className="text-gray-600 mt-2">{ev.commentaire}</p>
                   </div>
                 ))
               ) : (
                 <p>Vous n'avez pas encore reçu d'évaluation.</p>
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
