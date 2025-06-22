import React from 'react';

const AnnonceTable = ({ annonces = [] }) => (
  <div className="overflow-x-auto rounded-lg border border-gray-200">
    <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
      <thead className="bg-gray-50">
        <tr>
          <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-left">Départ</th>
          <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-left">Destination</th>
          <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-left">Date</th>
          <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-left">Conducteur</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {annonces.length === 0 ? (
          <tr><td colSpan="4" className="text-center py-4 text-gray-500">Aucune annonce à afficher.</td></tr>
        ) : (
          annonces.map((a) => (
            <tr key={a._id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{a.depart || '-'}</td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">{a.destination || '-'}</td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">{a.dateTrajet ? new Date(a.dateTrajet).toLocaleDateString() : '-'}</td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">{a.conducteur?.name || 'Non spécifié'}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default AnnonceTable;
