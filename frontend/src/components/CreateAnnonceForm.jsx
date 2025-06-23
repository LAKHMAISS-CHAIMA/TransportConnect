import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from '../config';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

const villes = [
  "Casablanca", "Rabat", "Tanger", "Fès", "Marrakech", "Agadir", "Oujda", "Kenitra", "Tétouan", "Safi"
];
const typesMarchandise = [
  "Documents", "Électronique", "Vêtements", "Alimentaire", "Meubles", "Fragile", "Autre"
];

const annonceSchema = Yup.object().shape({
  depart: Yup.string().required('Le lieu de départ est requis'),
  etapes: Yup.string(),
  destination: Yup.string().required('La destination est requise'),
  dateTrajet: Yup.date().required('La date du trajet est requise'),
  dimensions: Yup.string().required('Les dimensions sont requises'),
  typeMarchandise: Yup.string().required('Le type de marchandise est requis'),
  capaciteDisponible: Yup.number().typeError('Capacité invalide').min(1, 'Capacité minimale 1kg').required('La capacité est requise'),
  prix: Yup.number().typeError('Prix invalide').min(0, 'Prix minimal 0 DH').required('Le prix est requis'),
});

const CreateAnnonceForm = () => {
  const [formData, setFormData] = useState({
    depart: "",
    etapes: "",
    destination: "",
    dateTrajet: "",
    dimensions: "",
    typeMarchandise: "",
    capaciteDisponible: "",
    prix: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await annonceSchema.validate(formData, { abortEarly: false });
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/annonces`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Annonce créée avec succès !");
      setFormData({
        depart: "",
        etapes: "",
        destination: "",
        dateTrajet: "",
        dimensions: "",
        typeMarchandise: "",
        capaciteDisponible: "",
        prix: "",
      });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        toast.error(err.errors[0]);
      } else {
        toast.error(err.response?.data?.message || "Erreur lors de la création !");
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-green-50 p-6 rounded-3xl shadow-2xl max-w-2xl w-full">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl space-y-6 border border-blue-100">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl text-[#2a6f97]">📦</span>
          <h2 className="text-2xl font-extrabold text-[#2a6f97] tracking-tight">Créer une Annonce</h2>
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <label className="block mb-1 font-semibold text-blue-900">Ville de départ</label>
            <select name="depart" value={formData.depart} onChange={handleChange} className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 bg-blue-50" required>
              <option value="">Choisir la ville...</option>
              {villes.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold text-blue-900">Ville de destination</label>
            <select name="destination" value={formData.destination} onChange={handleChange} className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 bg-blue-50" required>
              <option value="">Choisir la ville...</option>
              {villes.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold text-blue-900">Étapes intermédiaires (optionnel)</label>
            <input type="text" name="etapes" value={formData.etapes} onChange={handleChange} placeholder="Étapes du trajet" className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 bg-blue-50" />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-blue-900">Date du trajet</label>
            <input type="date" name="dateTrajet" value={formData.dateTrajet} onChange={handleChange} className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 bg-blue-50" required />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-blue-900">Dimensions max (ex: 1m x 1m x 2m)</label>
            <input type="text" name="dimensions" value={formData.dimensions} onChange={handleChange} placeholder="Dimensions du véhicule ou de l'espace" className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 bg-blue-50" required />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-blue-900">Type de marchandise</label>
            <select name="typeMarchandise" value={formData.typeMarchandise} onChange={handleChange} className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 bg-blue-50" required>
              <option value="">Choisir le type...</option>
              {typesMarchandise.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold text-blue-900">Capacité Disponible (en kg)</label>
            <input type="number" name="capaciteDisponible" value={formData.capaciteDisponible} onChange={handleChange} placeholder="Capacité en kg" className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 bg-blue-50" min="1" required />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-blue-900">Prix (DH)</label>
            <input type="number" name="prix" value={formData.prix} onChange={handleChange} placeholder="Prix proposé" className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 bg-blue-50" min="0" required />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#2a6f97] to-[#61a5c2] hover:from-[#1e4e6c] hover:to-[#468fae] text-white font-extrabold py-3 rounded-2xl text-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <span>Créer l'annonce</span> <span className="text-xl">➕</span>
        </button>
      </form>
    </div>
  );
};

export default CreateAnnonceForm;
