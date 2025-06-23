import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { API_BASE_URL } from "../config";

const typesColis = [
  "Documents", "Électronique", "Vêtements", "Alimentaire", "Meubles", "Fragile", "Autre"
];

const demandeSchema = Yup.object().shape({
  typeColis: Yup.string().required("Le type de colis est requis"),
  dimensions: Yup.string().required("Les dimensions sont requises"),
  poids: Yup.number().typeError("Poids invalide").min(1, "Poids minimal 1kg").required("Le poids est requis"),
  description: Yup.string().min(5, "La description doit faire au moins 5 caractères").required("La description est requise"),
  message: Yup.string(), 
});

export default function CreateDemandeForm({ annonceId, onSuccess }) {
  const [formData, setFormData] = useState({
    typeColis: "",
    dimensions: "",
    poids: "",
    description: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await demandeSchema.validate(formData, { abortEarly: false });
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/demandes`,
        { ...formData, annonceId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Demande envoyée avec succès !");
      setFormData({ typeColis: "", dimensions: "", poids: "", description: "", message: "" });
      if (onSuccess) onSuccess();
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        toast.error(err.errors[0]);
      } else {
        toast.error(err.response?.data?.message || "Erreur lors de l'envoi de la demande !");
      }
    }
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-green-50 p-6 rounded-3xl shadow-2xl max-w-2xl w-full">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl space-y-6 border border-blue-100">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl text-[#2a6f97]">📨</span>
          <h3 className="text-2xl font-extrabold text-[#2a6f97] tracking-tight">Créer une Demande</h3>
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <label className="block mb-1 font-semibold text-blue-900">Type de colis</label>
            <select name="typeColis" value={formData.typeColis} onChange={handleChange} className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 bg-blue-50" required>
              <option value="">Choisir le type...</option>
              {typesColis.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold text-blue-900">Dimensions (ex: 50x40x30cm)</label>
            <input type="text" name="dimensions" value={formData.dimensions} onChange={handleChange} className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 bg-blue-50" required />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-blue-900">Poids (kg)</label>
            <input type="number" name="poids" value={formData.poids} onChange={handleChange} className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 bg-blue-50" min="1" required />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-blue-900">Description détaillée</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 bg-blue-50" rows={2} required />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-blue-900">Message au conducteur (optionnel)</label>
            <textarea name="message" value={formData.message} onChange={handleChange} className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-50 bg-blue-50" rows={2} />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#2a6f97] to-[#61a5c2] hover:from-[#1e4e6c] hover:to-[#468fae] text-white font-extrabold py-3 rounded-2xl text-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <span>{loading ? "Envoi en cours..." : "Envoyer la demande"}</span> <span className="text-xl">📨</span>
        </button>
      </form>
    </div>
  );
} 