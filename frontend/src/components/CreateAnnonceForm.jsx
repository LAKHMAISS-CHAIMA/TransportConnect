import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from '../config';

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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
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
      setSuccess("Annonce créée avec succès !");
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
      setError(err.response?.data?.message || "Erreur lors de la création !");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-center text-zellige">Créer une annonce</h2>
      {error && <div className="text-red-600 text-center">{error}</div>}
      {success && <div className="text-green-600 text-center">{success}</div>}
      {[
        { name: "depart", placeholder: "Lieu de départ" },
        { name: "etapes", placeholder: "Étapes intermédiaires (optionnel)" },
        { name: "destination", placeholder: "Destination" },
        { name: "dimensions", placeholder: "Dimensions max (ex: 1m x 1m x 2m)" },
        { name: "typeMarchandise", placeholder: "Type de marchandise" },
        { name: "capaciteDisponible", placeholder: "Capacité dispo (kg)", type: "number" },
      ].map(({ name, placeholder, type = "text" }) => (
        <input
          key={name}
          type={type}
          name={name}
          placeholder={placeholder}
          value={formData[name]}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zellige"
        />
      ))}
      <input
        type="date"
        name="dateTrajet"
        value={formData.dateTrajet}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zellige"
      />
      <div className="mb-4">
        <label htmlFor="capaciteDisponible" className="block text-gray-700 font-bold mb-2">Capacité Disponible (en kg)</label>
        <input
          type="number"
          name="capaciteDisponible"
          value={formData.capaciteDisponible}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zellige"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="prix" className="block text-gray-700 font-bold mb-2">Prix (DH)</label>
        <input
          type="number"
          name="prix"
          value={formData.prix}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zellige"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-zellige hover:bg-green-700 text-white font-bold py-2 rounded-lg transition"
      >
        Publier l'annonce
      </button>
    </form>
  );
};

export default CreateAnnonceForm;
