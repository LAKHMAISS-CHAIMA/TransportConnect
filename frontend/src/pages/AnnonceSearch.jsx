import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function AnnonceSearch() {
  const { user } = useAuth();
  const [annonces, setAnnonces] = useState([]);
  const [selectedAnnonce, setSelectedAnnonce] = useState(null);
  const [demandeForm, setDemandeForm] = useState({ dimensions: "", typeColis: "", description: "", poids: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  const [filters, setFilters] = useState({ 
    depart: "", 
    destination: "", 
    date: "",
    prixMin: "",
    prixMax: "",
    typeMarchandise: "",
    capaciteMin: "",
    capaciteMax: ""
  });

  const fetchAnnonces = async (searchParams = {}) => {
    setLoading(true);
    try {
      const res = await axios.get("/api/annonces/recherche", { params: searchParams });
      let annoncesFiltrees = (Array.isArray(res.data) ? res.data : []).filter(a => a.conducteur !== user._id && a.conducteur?._id !== user._id);
      
      if (searchParams.prixMin) {
        annoncesFiltrees = annoncesFiltrees.filter(a => a.prix >= parseFloat(searchParams.prixMin));
      }
      if (searchParams.prixMax) {
        annoncesFiltrees = annoncesFiltrees.filter(a => a.prix <= parseFloat(searchParams.prixMax));
      }
      if (searchParams.typeMarchandise) {
        annoncesFiltrees = annoncesFiltrees.filter(a => 
          a.typeMarchandise?.toLowerCase().includes(searchParams.typeMarchandise.toLowerCase())
        );
      }
      if (searchParams.capaciteMin) {
        annoncesFiltrees = annoncesFiltrees.filter(a => {
          const capacite = parseFloat(a.capaciteDisponible);
          return capacite >= parseFloat(searchParams.capaciteMin);
        });
      }
      if (searchParams.capaciteMax) {
        annoncesFiltrees = annoncesFiltrees.filter(a => {
          const capacite = parseFloat(a.capaciteDisponible);
          return capacite <= parseFloat(searchParams.capaciteMax);
        });
      }
      
      setAnnonces(annoncesFiltrees);
      setError("");
    } catch {
      setError("Erreur lors du chargement des annonces.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user?._id) fetchAnnonces();
  }, [user]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAnnonces(filters);
  };

  const handleResetFilters = () => {
    setFilters({ 
      depart: "", 
      destination: "", 
      date: "",
      prixMin: "",
      prixMax: "",
      typeMarchandise: "",
      capaciteMin: "",
      capaciteMax: ""
    });
    fetchAnnonces();
  };

  const handleOpenDemande = (annonce) => {
    setSelectedAnnonce(annonce);
    setDemandeForm({ dimensions: "", typeColis: "", description: "", poids: "" });
    setMessage("");
    setError("");
  };

  const handleSendDemande = async (e) => {
    e.preventDefault();
    setSending(true);
    setMessage("");
    setError("");
    try {
      await axios.post("/api/demandes", {
        annonceId: selectedAnnonce._id,
        ...demandeForm
      });
      setMessage("Demande envoyée avec succès !");
      setSelectedAnnonce(null);
    } catch {
      setError("Erreur lors de l'envoi de la demande.");
    }
    setSending(false);
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <h2 className="text-2xl font-bold mb-4 text-blue-700"> Recherche avancée d'annonces</h2>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Filtres de recherche</h3>
          <button
            type="button"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showAdvancedFilters ? "Masquer" : "Afficher"} les filtres avancés
          </button>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="depart"
              placeholder=" Ville de départ"
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.depart}
              onChange={handleFilterChange}
            />
            <input
              type="text"
              name="destination"
              placeholder=" Ville de destination"
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.destination}
              onChange={handleFilterChange}
            />
            <input
              type="date"
              name="date"
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.date}
              onChange={handleFilterChange}
            />
          </div>

          {showAdvancedFilters && (
            <div className="border-t pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <input
                  type="number"
                  name="prixMin"
                  placeholder=" Prix minimum (€)"
                  className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.prixMin}
                  onChange={handleFilterChange}
                  min="0"
                />
                <input
                  type="number"
                  name="prixMax"
                  placeholder=" Prix maximum (DH)"
                  className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.prixMax}
                  onChange={handleFilterChange}
                  min="0"
                />
                <input
                  type="text"
                  name="typeMarchandise"
                  placeholder=" Type de marchandise"
                  className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.typeMarchandise}
                  onChange={handleFilterChange}
                />
                <input
                  type="number"
                  name="capaciteMin"
                  placeholder=" Capacité min (kg)"
                  className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.capaciteMin}
                  onChange={handleFilterChange}
                  min="0"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="number"
                  name="capaciteMax"
                  placeholder=" Capacité max (kg)"
                  className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.capaciteMax}
                  onChange={handleFilterChange}
                  min="0"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors duration-200 flex-1"
            >
               Rechercher
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold transition-colors duration-200 flex-1"
            >
               Réinitialiser
            </button>
          </div>
        </form>
      </div>
      
      {message && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg border border-green-200">{message}</div>}
      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">{error}</div>}
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-blue-50 border-b">
          <h3 className="text-lg font-semibold text-blue-800">
           Résultats ({annonces.length} annonce{annonces.length > 1 ? 's' : ''})
          </h3>
        </div>
        
        {loading ? (
          <div className="text-center py-8 text-blue-600">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            Chargement des annonces...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-blue-100 text-blue-900">
                  <th className="py-3 px-4 text-left"> Départ</th>
                  <th className="py-3 px-4 text-left"> Destination</th>
                  <th className="py-3 px-4 text-left"> Date</th>
                  <th className="py-3 px-4 text-left"> Type</th>
                  <th className="py-3 px-4 text-left"> Capacité</th>
                  <th className="py-3 px-4 text-left"> Prix</th>
                  <th className="py-3 px-4 text-left"> Conducteur</th>
                  <th className="py-3 px-4 text-left"> Action</th>
                </tr>
              </thead>
              <tbody>
                {annonces.map((a) => (
                  <tr key={a._id} className="border-b hover:bg-gray-50 transition-colors duration-150">
                    <td className="py-3 px-4 font-medium">{a.depart}</td>
                    <td className="py-3 px-4 font-medium">{a.destination}</td>
                    <td className="py-3 px-4">{a.dateTrajet ? new Date(a.dateTrajet).toLocaleDateString('fr-FR') : "-"}</td>
                    <td className="py-3 px-4">{a.typeMarchandise}</td>
                    <td className="py-3 px-4">{a.capaciteDisponible} kg</td>
                    <td className="py-3 px-4 font-bold text-green-600">{a.prix} €</td>
                    <td className="py-3 px-4">{a.conducteur?.name || a.conducteur?.firstname || "-"}</td>
                    <td className="py-3 px-4">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                        onClick={() => handleOpenDemande(a)}
                      >
                         Créer une demande
                      </button>
                    </td>
                  </tr>
                ))}
                {annonces.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">🔍</div>
                      Aucune annonce disponible correspondant à votre recherche !
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedAnnonce && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <button 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold" 
              onClick={() => setSelectedAnnonce(null)}
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4 text-blue-700"> Créer une demande</h3>
            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-blue-800">
                <strong>Trajet :</strong> {selectedAnnonce.depart} → {selectedAnnonce.destination}
              </p>
              <p className="text-sm text-blue-800">
                <strong>Prix :</strong> {selectedAnnonce.prix} DH
              </p>
            </div>
            <form onSubmit={handleSendDemande} className="space-y-4">
              <input
                type="text"
                placeholder=" Dimensions (ex: 50x40x30cm)"
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={demandeForm.dimensions}
                onChange={e => setDemandeForm({ ...demandeForm, dimensions: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder=" Type de colis"
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={demandeForm.typeColis}
                onChange={e => setDemandeForm({ ...demandeForm, typeColis: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder=" Poids (kg)"
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={demandeForm.poids}
                onChange={e => setDemandeForm({ ...demandeForm, poids: e.target.value })}
                required
                min="1"
              />
              <textarea
                placeholder=" Description détaillée"
                className="border border-gray-300 p-3 rounded-lg w-full h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={demandeForm.description}
                onChange={e => setDemandeForm({ ...demandeForm, description: e.target.value })}
                required
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg w-full font-bold transition-colors duration-200 disabled:opacity-50"
                disabled={sending}
              >
                {sending ? " Envoi..." : " Envoyer la demande"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 