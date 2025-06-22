import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ActivityChart from "../components/ActivityChart";
import PieChart from "../components/PieChart";
import Paiement from "../components/Paiement";

const StarRating = ({ rating, setRating }) => (
  <div className="flex">
    {[...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <span
          key={starValue}
          className={`cursor-pointer text-3xl ${starValue <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          onClick={() => setRating(starValue)}
        >★</span>
      );
    })}
  </div>
);

export default function ExpediteurDashboard() {
  const { user } = useAuth();
  const [demandes, setDemandes] = useState([]);
  const [stats, setStats] = useState({ total: 0, acceptees: 0, refusees: 0, en_attente: 0 });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showEvalModal, setShowEvalModal] = useState(false);
  const [evaluation, setEvaluation] = useState({ note: 0, commentaire: '', annonceId: null, utilisateurEvalueId: null });

  const [demandesByMonth, setDemandesByMonth] = useState([]);
  const [demandesStatus, setDemandesStatus] = useState({});

  const [showPaiementModal, setShowPaiementModal] = useState(false);
  const [demandeAPayer, setDemandeAPayer] = useState(null);

  const fetchDemandes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/demandes/mes-demandes`);
      const demandesData = Array.isArray(res.data) ? res.data : [];
      setDemandes(demandesData);
      
      const total = demandesData.length;
      const acceptees = demandesData.filter(d => d.statut === "acceptée").length;
      const refusees = demandesData.filter(d => d.statut === "refusée").length;
      const en_attente = demandesData.filter(d => d.statut === "en attente").length;
      setStats({ total, acceptees, refusees, en_attente });

      const monthlyDemandes = demandesData.reduce((acc, d) => {
        const monthYear = new Date(d.createdAt).toLocaleDateString('fr-FR', { month: '2-digit', year: 'numeric' });
        acc[monthYear] = (acc[monthYear] || 0) + 1;
        return acc;
      }, {});
      setDemandesByMonth(Object.entries(monthlyDemandes).map(([key, value]) => ({ _id: { month: key.split('/')[0], year: key.split('/')[1] }, total: value })));
      
      const statusCounts = demandesData.reduce((acc, d) => {
        acc[d.statut] = (acc[d.statut] || 0) + 1;
        return acc;
      }, {});
      setDemandesStatus(statusCounts);

      setError("");
    } catch (err) {
      setError("Impossible de charger vos demandes.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user?._id) fetchDemandes();
  }, [user]);

  const handleOpenEvalModal = (annonce) => {
    setEvaluation({ 
      note: 0, 
      commentaire: '', 
      annonceId: annonce._id, 
      utilisateurEvalueId: annonce.conducteur._id
    });
    setShowEvalModal(true);
  };

  const handleSendEvaluation = async (e) => {
    e.preventDefault();
    if (evaluation.note === 0) {
      alert("Veuillez donner une note (au moins une étoile).");
      return;
    }
    try {
      await axios.post("/api/evaluations", evaluation);
      setMessage("Évaluation envoyée avec succès !");
      setShowEvalModal(false);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'envoi de l'évaluation.");
    }
  };

  const handleCancelDemande = async (id) => {
    if (!window.confirm("Voulez-vous vraiment annuler cette demande ?")) return;
    try {
      await axios.delete(`/api/demandes/${id}`);
      setMessage("Demande annulée avec succès !");
      setDemandes(demandes.filter(d => d._id !== id));
    } catch {
      setError("Erreur lors de l'annulation de la demande.");
    }
  };
  
  const getStatusClass = (statut) => {
    switch (statut) {
      case 'acceptée': return 'bg-green-100 text-green-800';
      case 'refusée': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleOpenPaiementModal = (demande) => {
    setDemandeAPayer(demande);
    setShowPaiementModal(true);
  };
  
  const handlePaiementSuccess = async (demandeId) => {
    try {
      await axios.put(`/api/demandes/${demandeId}/payer`);
      setDemandes(demandes.map(d => 
        d._id === demandeId ? { ...d, statut: 'payée' } : d
      ));
      setMessage("Paiement effectué avec succès !");
    } catch (err) {
      setError("Erreur lors de la mise à jour du statut après paiement.");
    }
    setShowPaiementModal(false);
  };

  return (
    <div className="min-h-screen bg-[#fdf6e3] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 p-6 bg-[#2a6f97] rounded-2xl shadow-lg text-white">
          <h1 className="text-4xl font-bold font-serif">Dashboard Expéditeur</h1>
          <p className="mt-2 text-blue-200">Suivez vos demandes et trouvez les meilleurs trajets. </p>
        </div>
        
        {message && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg border border-green-200">{message}</div>}
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200">{error}</div>}

        {loading ? (
          <div className="text-center p-8">Chargement de vos données...</div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-amber-400">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Demandes Envoyées par Mois</h3>
                <ActivityChart 
                  data={demandesByMonth}
                  title="Demandes par mois"
                  color="#1d4ed8" 
                />
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-800">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Répartition des Demandes</h3>
                <PieChart 
                  data={demandesStatus}
                  title="Statuts des demandes"
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Suivi de vos Demandes</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded shadow">
                  <thead>
                    <tr className="bg-purple-200 text-purple-900">
                      <th className="py-2 px-4">Annonce</th>
                      <th className="py-2 px-4">Date de la demande</th>
                      <th className="py-2 px-4">Conducteur</th>
                      <th className="py-2 px-4">Statut</th>
                      <th className="py-2 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demandes.map((d) => {
                      const isTrajetTermine = new Date(d.annonce?.dateTrajet) < new Date();
                      const peutPayer = d.statut === 'acceptée' && !isTrajetTermine;
                      const peutEvaluer = d.statut === 'payée' && isTrajetTermine;

                      return (
                        <tr key={d._id} className="border-b">
                          <td className="py-2 px-4">{d.annonce?.depart} → {d.annonce?.destination}</td>
                          <td className="py-2 px-4">{new Date(d.createdAt).toLocaleDateString()}</td>
                          <td className="py-2 px-4">{d.annonce?.conducteur?.name || d.annonce?.conducteur?.firstname || '-'}</td>
                          <td className="py-2 px-4">
                            <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusClass(d.statut)}`}>
                              {d.statut}
                            </span>
                          </td>
                          <td className="py-2 px-4 flex gap-2">
                            {d.statut === "en attente" && (
                              <button onClick={() => handleCancelDemande(d._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">Annuler</button>
                            )}
                            {peutPayer && (
                              <button onClick={() => handleOpenPaiementModal(d)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">Payer</button>
                            )}
                            {peutEvaluer && (
                              <button onClick={() => handleOpenEvalModal(d.annonce)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm">Évaluer</button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                    {demandes.length === 0 && (
                      <tr><td colSpan="5" className="text-center py-4">Vous n'avez envoyé aucune demande.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
      {showEvalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Laisser une évaluation</h3>
            <form onSubmit={handleSendEvaluation}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Note</label>
                <StarRating rating={evaluation.note} setRating={(note) => setEvaluation({...evaluation, note})} />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Commentaire</label>
                <textarea 
                  className="w-full border p-2 rounded"
                  rows="4"
                  value={evaluation.commentaire}
                  onChange={(e) => setEvaluation({...evaluation, commentaire: e.target.value})}
                  placeholder="Comment s'est passé le trajet ?"
                ></textarea>
              </div>
              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setShowEvalModal(false)} className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded">Annuler</button>
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">Envoyer</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showPaiementModal && demandeAPayer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
            <button onClick={() => setShowPaiementModal(false)} className="absolute top-2 right-4 text-2xl">&times;</button>
            <Paiement 
              demande={demandeAPayer}
              onSuccess={() => handlePaiementSuccess(demandeAPayer._id)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
