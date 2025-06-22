import React from 'react';

const DemandeTable = ({ demandes = [] }) => (
  <table className="min-w-full bg-white border">
    <thead>
      <tr>
        <th className="py-2 px-4 border">Expéditeur</th>
        <th className="py-2 px-4 border">Annonce</th>
        <th className="py-2 px-4 border">Statut</th>
        <th className="py-2 px-4 border">Date</th>
      </tr>
    </thead>
    <tbody>
      {demandes.length === 0 ? (
        <tr><td colSpan={4} className="text-center py-4">Aucune demande</td></tr>
      ) : (
        demandes.map((d, i) => (
          <tr key={i}>
            <td className="border px-4 py-2">{d.expediteur?.email || '-'}</td>
            <td className="border px-4 py-2">{d.annonce?.destination || '-'}</td>
            <td className="border px-4 py-2">{d.statut || '-'}</td>
            <td className="border px-4 py-2">{d.createdAt ? new Date(d.createdAt).toLocaleDateString() : '-'}</td>
          </tr>
        ))
      )}
    </tbody>
  </table>
);

export default DemandeTable;
