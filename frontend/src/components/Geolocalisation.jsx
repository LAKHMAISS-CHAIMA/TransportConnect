import React, { useState, useEffect } from 'react';

const Geolocalisation = ({ depart, destination, isActive = false }) => {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCurrentPosition = () => {
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition(pos.coords);
        setLoading(false);
      },
      (err) => {
        setError("Impossible de simuler la position. Avez-vous autorisé la géolocalisation ?");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    if (isActive) {
      getCurrentPosition();
      const interval = setInterval(getCurrentPosition, 30000);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  if (isActive) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-600">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Suivi en temps réel (Simulation)</h3>
          {loading && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>}
        </div>
        {error && <p className="text-red-500 bg-red-100 p-2 rounded">{error}</p>}
        {position ? (
          <div className="space-y-2">
            <p><strong>Latitude:</strong> {position.latitude.toFixed(4)}</p>
            <p><strong>Longitude:</strong> {position.longitude.toFixed(4)}</p>
            <a href={`https://www.google.com/maps?q=${position.latitude},${position.longitude}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Ouvrir dans Google Maps
            </a>
          </div>
        ) : !error && !loading ? (
            <p>En attente de la première position...</p>
        ) : null}
      </div>
    );
  }

  if (!depart || !destination) {
    return <div className="p-4 text-center text-gray-500">Départ et destination non fournis.</div>;
  }

  const encodedDepart = encodeURIComponent(depart);
  const encodedDestination = encodeURIComponent(destination);
  const mapUrl = `https://www.google.com/maps/embed/v1/directions?key=YOUR_API_KEY&origin=${encodedDepart}&destination=${encodedDestination}`;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-600">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Itinéraire du trajet</h3>
      <div className="w-full h-96 rounded-lg overflow-hidden border">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          src={mapUrl}
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default Geolocalisation; 