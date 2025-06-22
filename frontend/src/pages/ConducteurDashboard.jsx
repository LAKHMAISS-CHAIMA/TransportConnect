import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import ActivityChart from "../components/ActivityChart";
import PieChart from "../components/PieChart";
import Geolocalisation from "../components/Geolocalisation";
import AnnonceTable from "../components/AnnonceTable";

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

export default function ConducteurDashboard() {
  const { user } = useAuth();
  const [annonces, setAnnonces] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [stats, setStats] = useState({ annonces: 0, demandes: 0, acceptées: 0, refusées: 0 });
  const [demandesByMonth, setDemandesByMonth] = useState([]);
  const [demandesStatus, setDemandesStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    depart: "",
    etapes: "",
    destination: "",
    dateTrajet: "",
    dimensions: "",
    typeMarchandise: "",
    capaciteDisponible: "",
    description: "",
    prix: ""
  });
  const [creating, setCreating] = useState(false);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ type: '', data: [] });

  const [showEvalModal, setShowEvalModal] = useState(false);
  const [evaluation, setEvaluation] = useState({ note: 0, commentaire: '', annonceId: null, utilisateurEvalueId: null });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const annoncesRes = await axios.get(`/api/annonces`);
        const myAnnonces = (Array.isArray(annoncesRes.data) ? annoncesRes.data : []).filter(a => a.conducteur === user._id || a.conducteur?._id === user._id);
        setAnnonces(myAnnonces);

        let allDemandes = [];
        for (const annonce of myAnnonces) {
          try {
            const demandesRes = await axios.get(`/api/demandes/annonce/${annonce._id}`);
            if (Array.isArray(demandesRes.data)) {
              allDemandes = allDemandes.concat(demandesRes.data.map(d => ({ ...d, annonce })));
            }
          } catch {}
        }
        setDemandes(allDemandes);

        const monthlyDemandes = allDemandes.reduce((acc, d) => {
            const monthYear = new Date(d.createdAt).toLocaleDateString('fr-FR', { month: '2-digit', year: 'numeric' });
            acc[monthYear] = (acc[monthYear] || 0) + 1;
            return acc;
        }, {});
        setDemandesByMonth(Object.entries(monthlyDemandes).map(([key, value]) => ({ _id: { month: key.split('/')[0], year: key.split('/')[1] }, total: value })));
        
        const statusCounts = allDemandes.reduce((acc, d) => {
            acc[d.statut] = (acc[d.statut] || 0) + 1;
            return acc;
        }, {});
        setDemandesStatus(statusCounts);

        const nbAnnonces = myAnnonces.length;
        const nbDemandes = allDemandes.length;
        const nbAcceptees = allDemandes.filter(d => d.statut === "acceptée").length;
        const nbRefusees = allDemandes.filter(d => d.statut === "refusée").length;
        setStats({ annonces: nbAnnonces, demandes: nbDemandes, acceptées: nbAcceptees, refusées: nbRefusees });
        setError("");
      } catch (err) {
        setError("Erreur de connexion au serveur. Réessayez plus tard !");
      }
      setLoading(false);
    };
    if (user?._id) fetchData();
  }, [user]);

  const isFormValid = Object.values(form).every(v => v !== "");

  const handleCreateAnnonce = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (!isFormValid) {
      setError("Veuillez remplir tous les champs du formulaire.");
      return;
    }
    setCreating(true);
    try {
      const res = await axios.post(`/api/annonces`, {
        ...form,
        capaciteDisponible: Number(form.capaciteDisponible),
        prix: Number(form.prix)
      });
      setAnnonces([res.data, ...annonces]);
      setForm({
        depart: "",
        etapes: "",
        destination: "",
        dateTrajet: "",
        dimensions: "",
        typeMarchandise: "",
        capaciteDisponible: "",
        description: "",
        prix: ""
      });
      setMessage("Annonce créée avec succès !");
      setError("");
    } catch {
      setError("Impossible de créer l'annonce. Vérifiez les champs et réessayez !");
    }
    setCreating(false);
  };

  const handleDeleteAnnonce = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette annonce ?")) return;
    try {
      await axios.delete(`/api/annonces/${id}`);
      setAnnonces(annonces.filter((a) => a._id !== id));
      setMessage("Annonce supprimée avec succès !");
      setError("");
    } catch {
      setError("Impossible de supprimer l'annonce. Réessayez plus tard !");
    }
  };

  const handleAccepter = async (id) => {
    try {
      const res = await axios.put(`/api/demandes/${id}`, { statut: 'acceptée' });
      setDemandes(demandes.map(d => d._id === id ? res.data : d));
      setMessage("Demande acceptée ! Une notification sera envoyée à l'expéditeur.");
      setError("");
    } catch (err) {
      setError("Impossible d'accepter la demande.");
    }
  };

  const handleRefuser = async (id) => {
    try {
      const res = await axios.put(`/api/demandes/${id}`, { statut: 'refusée' });
      setDemandes(demandes.map(d => d._id === id ? res.data : d));
      setMessage("Demande refusée.");
      setError("");
    } catch (err) {
      setError("Impossible de refuser la demande.");
    }
  };

  const handleOpenEvalModal = (demande) => {
    setEvaluation({
      note: 0,
      commentaire: '',
      annonceId: demande.annonce._id,
      utilisateurEvalueId: demande.expediteur._id
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

  const handleCardClick = (type) => {
    let content = { type: '', data: [] };
    if (type === 'annonces') {
      content = { type: 'Mes Annonces', data: annonces };
    } else if (type === 'demandes') {
      content = { type: 'Demandes Reçues', data: demandes };
    } else {
      return; 
    }
    setModalContent(content);
    setIsModalOpen(true);
  };
  
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-[#fdf6e3] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 p-6 bg-[#2a6f97] rounded-2xl shadow-lg text-white">
          <h1 className="text-4xl font-bold font-serif">Dashboard Conducteur</h1>
          <p className="mt-2 text-blue-200">Gérez vos trajets et vos demandes. Bonne route ! </p>
        </div>

        {message && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg border border-green-200">{message}</div>}
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200">{error}</div>}

        {loading ? (
          <div className="text-center p-8">Chargement de vos données...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div onClick={() => handleCardClick('annonces')} className="bg-white rounded shadow p-4 flex flex-col items-center border-b-4 border-green-400 cursor-pointer hover:shadow-xl hover:scale-105 transition-transform">
                <span className="text-2xl font-bold text-green-700">{stats.annonces}</span>
                <span className="text-gray-600">Mes annonces</span>
              </div>
              <div onClick={() => handleCardClick('demandes')} className="bg-white rounded shadow p-4 flex flex-col items-center border-b-4 border-yellow-400 cursor-pointer hover:shadow-xl hover:scale-105 transition-transform">
                <span className="text-2xl font-bold text-yellow-700">{stats.demandes}</span>
                <span className="text-gray-600">Demandes reçues</span>
              </div>
              <div className="bg-white rounded shadow p-4 flex flex-col items-center border-b-4 border-blue-400">
                <span className="text-2xl font-bold text-blue-700">{stats.acceptées}</span>
                <span className="text-gray-600">Demandes acceptées</span>
              </div>
              <div className="bg-white rounded shadow p-4 flex flex-col items-center border-b-4 border-red-400">
                <span className="text-2xl font-bold text-red-700">{stats.refusées}</span>
                <span className="text-gray-600">Demandes refusées</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
              <div className="bg-white p-4 rounded-lg shadow">
                <ActivityChart 
                  data={demandesByMonth}
                  title="Demandes reçues par mois"
                  color="#f97316"
                />
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <PieChart 
                  data={demandesStatus}
                  title="Répartition des demandes"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-8">
                <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-600">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Créer une Annonce</h2>
                    <form onSubmit={handleCreateAnnonce} className="bg-white rounded shadow p-4 mb-8 flex flex-col gap-4 max-w-xl">
                      <label className="font-medium">Départ
                        <input
                          type="text"
                          name="depart"
                          placeholder="Ville de départ"
                          className="border p-2 rounded w-full mt-1"
                          value={form.depart}
                          onChange={e => setForm({ ...form, depart: e.target.value })}
                          required
                        />
                      </label>
                      <label className="font-medium">Étapes (optionnel)
                        <input
                          type="text"
                          name="etapes"
                          placeholder="Étapes du trajet"
                          className="border p-2 rounded w-full mt-1"
                          value={form.etapes}
                          onChange={e => setForm({ ...form, etapes: e.target.value })}
                        />
                      </label>
                      <label className="font-medium">Destination
                        <input
                          type="text"
                          name="destination"
                          placeholder="Ville d'arrivée"
                          className="border p-2 rounded w-full mt-1"
                          value={form.destination}
                          onChange={e => setForm({ ...form, destination: e.target.value })}
                          required
                        />
                      </label>
                      <label className="font-medium">Date du trajet
                        <input
                          type="date"
                          name="dateTrajet"
                          className="border p-2 rounded w-full mt-1"
                          value={form.dateTrajet}
                          onChange={e => setForm({ ...form, dateTrajet: e.target.value })}
                          required
                        />
                      </label>
                      <label className="font-medium">Dimensions (ex: 2m x 1m x 1m)
                        <input
                          type="text"
                          name="dimensions"
                          placeholder="Dimensions du véhicule ou de l'espace"
                          className="border p-2 rounded w-full mt-1"
                          value={form.dimensions}
                          onChange={e => setForm({ ...form, dimensions: e.target.value })}
                          required
                        />
                      </label>
                      <label className="font-medium">Type de marchandise
                        <input
                          type="text"
                          name="typeMarchandise"
                          placeholder="Type de marchandise acceptée"
                          className="border p-2 rounded w-full mt-1"
                          value={form.typeMarchandise}
                          onChange={e => setForm({ ...form, typeMarchandise: e.target.value })}
                          required
                        />
                      </label>
                      <label className="font-medium">Capacité disponible (kg)
                        <input
                          type="number"
                          name="capaciteDisponible"
                          placeholder="Capacité en kg"
                          className="border p-2 rounded w-full mt-1"
                          value={form.capaciteDisponible}
                          onChange={e => setForm({ ...form, capaciteDisponible: e.target.value })}
                          required
                          min="1"
                        />
                      </label>
                      <label className="font-medium">Prix (DH)
                        <input
                          type="number"
                          name="prix"
                          placeholder="Prix proposé"
                          className="border p-2 rounded w-full mt-1"
                          value={form.prix}
                          onChange={e => setForm({ ...form, prix: e.target.value })}
                          required
                          min="0"
                        />
                      </label>
                      <label className="font-medium">Description
                        <textarea
                          name="description"
                          placeholder="Description de l'annonce"
                          className="border p-2 rounded w-full mt-1"
                          value={form.description}
                          onChange={e => setForm({ ...form, description: e.target.value })}
                          required
                        />
                      </label>
                      <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold"
                        disabled={!isFormValid || creating}
                      >{creating ? "Création..." : "Créer l'annonce"}</button>
                    </form>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Mes Annonces</h2>
                  <div className="overflow-x-auto mb-8">
                    <table className="min-w-full bg-white rounded shadow">
                      <thead>
                        <tr className="bg-green-200 text-green-900">
                          <th className="py-2 px-4">Départ</th>
                          <th className="py-2 px-4">Destination</th>
                          <th className="py-2 px-4">Date</th>
                          <th className="py-2 px-4">Type</th>
                          <th className="py-2 px-4">Capacité</th>
                          <th className="py-2 px-4">Prix</th>
                          <th className="py-2 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(Array.isArray(annonces) ? annonces : []).map((a) => (
                          <tr key={a._id} className="border-b">
                            <td className="py-2 px-4">{a.depart}</td>
                            <td className="py-2 px-4">{a.destination}</td>
                            <td className="py-2 px-4">{a.dateTrajet ? new Date(a.dateTrajet).toLocaleDateString() : "-"}</td>
                            <td className="py-2 px-4">{a.typeMarchandise}</td>
                            <td className="py-2 px-4">{a.capaciteDisponible} kg</td>
                            <td className="py-2 px-4">{a.prix} DH</td>
                            <td className="py-2 px-4">
                              <button
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                onClick={() => handleDeleteAnnonce(a._id)}
                              >Supprimer</button>
                            </td>
                          </tr>
                        ))}
                        {annonces.length === 0 && (
                          <tr><td colSpan="7" className="text-center py-4">Aucune annonce trouvée !</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Demandes Reçues</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr className="bg-yellow-200 text-yellow-900">
                          <th className="py-2 px-4">Annonce</th>
                          <th className="py-2 px-4">Expéditeur</th>
                          <th className="py-2 px-4">Statut</th>
                          <th className="py-2 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {demandes.map(d => (
                          <tr key={d._id}>
                            <td className="py-2 px-4">{d.annonceTitre || d.annonce?.titre || d.annonce?.depart + " → " + d.annonce?.destination || "-"}</td>
                            <td className="py-2 px-4">{d.expediteur?.name || d.expediteur?.firstname || "-"}</td>
                            <td className="py-2 px-4">{d.statut || d.status || "-"}</td>
                            <td className="py-2 px-4 flex gap-2">
                              <button onClick={() => setSelectedDemande(d)} className="bg-[#2a6f97] text-white px-3 py-1 rounded-md text-sm hover:bg-opacity-90">Détails</button>
                              {d.statut === 'en attente' && (
                                <>
                                  <button onClick={() => handleAccepter(d._id)} className="bg-[#007a33] text-white px-3 py-1 rounded-md text-sm hover:bg-opacity-90">Accepter</button>
                                  <button onClick={() => handleRefuser(d._id)} className="bg-[#c1272d] text-white px-3 py-1 rounded-md text-sm hover:bg-opacity-90">Refuser</button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                        {demandes.length === 0 && (
                          <tr><td colSpan="4" className="text-center py-4">Aucune demande reçue !</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </>
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
                  placeholder="Comment s'est passée la collaboration ?"
                ></textarea>
              </div>
              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setShowEvalModal(false)} className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded">Annuler</button>
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Envoyer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedDemande && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative">
            <button onClick={() => setSelectedDemande(null)} className="absolute top-4 right-4 text-2xl font-bold text-gray-500 hover:text-gray-800">&times;</button>
            <h3 className="text-2xl font-bold mb-4 text-[#2a6f97]">Détails</h3>
            
            <div className="space-y-4 text-gray-700">
              <div>
                <h4 className="font-bold text-lg text-gray-800 mb-2 border-b pb-1">Annonce concernée</h4>
                <p><strong>Trajet:</strong> {selectedDemande.annonce.depart} → {selectedDemande.annonce.destination}</p>
                <p><strong>Date:</strong> {new Date(selectedDemande.annonce.dateTrajet).toLocaleDateString()}</p>
                <p><strong>Expéditeur:</strong> {selectedDemande.expediteur?.name || 'Non disponible'}</p>
              </div>

              <div>
                <h4 className="font-bold text-lg text-gray-800 mb-2 border-b pb-1">Détails de la demande</h4>
                <p><strong>Type de colis:</strong> {selectedDemande.typeColis || 'N/A'}</p>
                <p><strong>Dimensions:</strong> {selectedDemande.dimensions || 'N/A'}</p>
                <p><strong>Poids:</strong> {selectedDemande.poids ? `${selectedDemande.poids} kg` : 'N/A'}</p>
                <p><strong>Description:</strong> {selectedDemande.description || 'N/A'}</p>
              </div>
              
              <hr />
              
              <p><strong>Statut:</strong> <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                selectedDemande.statut === 'acceptée' ? 'bg-green-100 text-green-800' : 
                selectedDemande.statut === 'refusée' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
              }`}>{selectedDemande.statut}</span></p>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-4 pb-4 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">{modalContent.type}</h2>
                    <button onClick={closeModal} className="text-gray-500 hover:text-gray-800 text-3xl font-bold">&times;</button>
                </div>
                <div className="overflow-y-auto">
                    {modalContent.type === 'Mes Annonces' && <AnnonceTable annonces={modalContent.data} handleDelete={handleDeleteAnnonce} />}
                    {modalContent.type === 'Demandes Reçues' && (
                        <table className="min-w-full bg-white">
                          <thead>
                            <tr className="bg-yellow-200 text-yellow-900">
                              <th className="py-2 px-4">Annonce</th>
                              <th className="py-2 px-4">Expéditeur</th>
                              <th className="py-2 px-4">Statut</th>
                              <th className="py-2 px-4">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {modalContent.data.map(d => (
                              <tr key={d._id}>
                                <td className="py-2 px-4">{d.annonce?.depart} → {d.annonce?.destination}</td>
                                <td className="py-2 px-4">{d.expediteur?.name}</td>
                                <td className="py-2 px-4">{d.statut}</td>
                                <td className="py-2 px-4 flex gap-2">
                                  <button onClick={() => { closeModal(); setSelectedDemande(d); }} className="bg-[#2a6f97] text-white px-3 py-1 rounded-md text-sm hover:bg-opacity-90">Détails</button>
                                  {d.statut === 'en attente' && (
                                    <>
                                      <button onClick={() => handleAccepter(d._id)} className="bg-[#007a33] text-white px-3 py-1 rounded-md text-sm hover:bg-opacity-90">Accepter</button>
                                      <button onClick={() => handleRefuser(d._id)} className="bg-[#c1272d] text-white px-3 py-1 rounded-md text-sm hover:bg-opacity-90">Refuser</button>
                                    </>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
