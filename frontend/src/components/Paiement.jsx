import React, { useState } from 'react';

export default function Paiement({ montant, trajetId, onPaiementComplete }) {
  const [methodePaiement, setMethodePaiement] = useState('carte');
  const [donneesPaiement, setDonneesPaiement] = useState({
    numeroCarte: '',
    dateExpiration: '',
    cvv: '',
    nomTitulaire: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    setDonneesPaiement({
      ...donneesPaiement,
      [e.target.name]: e.target.value
    });
  };

  const validerFormulaire = () => {
    if (!donneesPaiement.numeroCarte || !donneesPaiement.dateExpiration || 
        !donneesPaiement.cvv || !donneesPaiement.nomTitulaire || !donneesPaiement.email) {
      setError('Veuillez remplir tous les champs.');
      return false;
    }

    if (donneesPaiement.numeroCarte.length < 16) {
      setError('Le numéro de carte doit contenir 16 chiffres.');
      return false;
    }

    if (donneesPaiement.cvv.length < 3) {
      setError('Le code CVV doit contenir 3 chiffres.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validerFormulaire()) return;

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); 
      
      const success = Math.random() > 0.1;
      
      if (success) {
        setSuccess(true);
        if (onPaiementComplete) {
          onPaiementComplete({
            trajetId,
            montant,
            methodePaiement,
            date: new Date().toISOString(),
            transactionId: 'TXN' + Date.now()
          });
        }
      } else {
        setError('Paiement refusé. Veuillez vérifier vos informations ou contacter votre banque.');
      }
    } catch (err) {
      setError('Erreur lors du traitement du paiement. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-4xl mb-4"></div>
        <h3 className="text-xl font-bold text-green-800 mb-2">Paiement réussi !</h3>
        <p className="text-green-600 mb-4">
          Votre paiement de <strong>{montant} €</strong> a été traité avec succès.
        </p>
        <div className="bg-white p-3 rounded border">
          <p className="text-sm text-gray-600">
            <strong>ID Transaction :</strong> TXN{Date.now()}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Date :</strong> {new Date().toLocaleString('fr-FR')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2"> Paiement sécurisé</h2>
        <p className="text-gray-600">Montant à payer : <span className="font-bold text-green-600 text-xl">{montant} €</span></p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Méthode de paiement
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="methodePaiement"
                value="carte"
                checked={methodePaiement === 'carte'}
                onChange={(e) => setMethodePaiement(e.target.value)}
                className="mr-2"
              />
              <span> Carte bancaire</span>
            </label>
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="methodePaiement"
                value="paypal"
                checked={methodePaiement === 'paypal'}
                onChange={(e) => setMethodePaiement(e.target.value)}
                className="mr-2"
              />
              <span> PayPal</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Numéro de carte
            </label>
            <input
              type="text"
              name="numeroCarte"
              placeholder="1234 5678 9012 3456"
              value={donneesPaiement.numeroCarte}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength="19"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du titulaire
            </label>
            <input
              type="text"
              name="nomTitulaire"
              placeholder="Jean Dupont"
              value={donneesPaiement.nomTitulaire}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date d'expiration
            </label>
            <input
              type="text"
              name="dateExpiration"
              placeholder="MM/AA"
              value={donneesPaiement.dateExpiration}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength="5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code CVV
            </label>
            <input
              type="text"
              name="cvv"
              placeholder="123"
              value={donneesPaiement.cvv}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength="4"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email de confirmation
          </label>
          <input
            type="email"
            name="email"
            placeholder="votre@email.com"
            value={donneesPaiement.email}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800">
            <span className="text-lg">🔒</span>
            <p className="text-sm">
              Vos informations de paiement sont protégées par un chiffrement SSL 256-bit.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Traitement en cours...
            </div>
          ) : (
            `Payer ${montant} €`
          )}
        </button>
      </form>
    </div>
  );
} 