import React, { useState } from "react";
import axios from "axios";

const CreateAnnonceForm = () => {
  const [formData, setFormData] = useState({
    depart: "",
    etapes: "",
    destination: "",
    dateTrajet: "",
    dimensions: "",
    typeMarchandise: "",
    capaciteDisponible: "",
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
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/annonces",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Annonce créée avec succès !");
      setFormData({
        depart: "",
        etapes: "",
        destination: "",
        dateTrajet: "",
        dimensions: "",
        typeMarchandise: "",
        capaciteDisponible: "",
      });
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création !");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white rounded shadow space-y-4">
      <h2 className="text-2xl font-bold text-center">Créer une annonce</h2>

      <input
        type="text"
        name="depart"
        placeholder="Lieu de départ"
        value={formData.depart}
        onChange={handleChange}
        className="input-style"
      />

      <input
        type="text"
        name="etapes"
        placeholder="Étapes intermédiaires (optionnel)"
        value={formData.etapes}
        onChange={handleChange}
        className="input-style"
      />

      <input
        type="text"
        name="destination"
        placeholder="Destination"
        value={formData.destination}
        onChange={handleChange}
        className="input-style"
      />

      <input
        type="date"
        name="dateTrajet"
        value={formData.dateTrajet}
        onChange={handleChange}
        className="input-style"
      />

      <input
        type="text"
        name="dimensions"
        placeholder="Dimensions maximales (ex: 1m x 1m x 2m)"
        value={formData.dimensions}
        onChange={handleChange}
        className="input-style"
      />

      <input
        type="text"
        name="typeMarchandise"
        placeholder="Type de marchandise"
        value={formData.typeMarchandise}
        onChange={handleChange}
        className="input-style"
      />

      <input
        type="number"
        name="capaciteDisponible"
        placeholder="Capacité disponible (kg)"
        value={formData.capaciteDisponible}
        onChange={handleChange}
        className="input-style"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
      >
        Publier l’annonce
      </button>
    </form>
  );
};

export default CreateAnnonceForm;
