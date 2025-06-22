import React, { useState } from 'react';

const TrajetSearchForm = ({ onSearch }) => {
  const [depart, setDepart] = useState('');
  const [arrivee, setArrivee] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ depart, arrivee });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded shadow">
      <input type="text" placeholder="Ville de départ" value={depart} onChange={(e) => setDepart(e.target.value)} className="input" />
      <input type="text" placeholder="Ville d’arrivée" value={arrivee} onChange={(e) => setArrivee(e.target.value)} className="input" />
      <button type="submit" className="btn bg-blue-600 text-white">Rechercher</button>
    </form>
  );
};

export default TrajetSearchForm;
