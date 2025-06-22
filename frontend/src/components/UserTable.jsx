import React from 'react';

const UserTable = ({ users = [] }) => (
  <table className="min-w-full bg-white border">
    <thead>
      <tr>
        <th className="py-2 px-4 border">Nom</th>
        <th className="py-2 px-4 border">Email</th>
        <th className="py-2 px-4 border">Rôle</th>
        <th className="py-2 px-4 border">Statut</th>
      </tr>
    </thead>
    <tbody>
      {users.length === 0 ? (
        <tr><td colSpan={4} className="text-center py-4">Aucun utilisateur</td></tr>
      ) : (
        users.map((u, i) => (
          <tr key={i}>
            <td className="border px-4 py-2">{u.name}</td>
            <td className="border px-4 py-2">{u.email}</td>
            <td className="border px-4 py-2">{u.role}</td>
            <td className="border px-4 py-2">{u.isBanned ? 'Suspendu' : (u.isVerified ? 'Vérifié' : 'Non vérifié')}</td>
          </tr>
        ))
      )}
    </tbody>
  </table>
);

export default UserTable;
