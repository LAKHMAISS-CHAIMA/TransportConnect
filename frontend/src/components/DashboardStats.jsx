import React from 'react';
import { FaUsers, FaBoxOpen, FaRoute, FaPercentage } from 'react-icons/fa';

const DashboardStats = ({ stats, onCardClick }) => {
  const { users = 0, annonces = 0, demandes = 0, acceptanceRate = 0 } = stats || {};

  const statCards = [
    {
      id: "users",
      icon: <FaUsers className="text-4xl text-[#007a33]" />,
      label: "Utilisateurs",
      value: users,
      color: "border-[#007a33]",
    },
    {
      id: "annonces",
      icon: <FaBoxOpen className="text-4xl text-[#c1272d]" />,
      label: "Annonces",
      value: annonces,
      color: "border-[#c1272d]",
    },
    {
      id: "demandes",
      icon: <FaRoute className="text-4xl text-[#2a6f97]" />,
      label: "Demandes",
      value: demandes,
      color: "border-[#2a6f97]",
    },
    {
      id: "acceptanceRate",
      icon: <FaPercentage className="text-4xl text-amber-500" />,
      label: "Taux d'Acceptation",
      value: `${acceptanceRate ? acceptanceRate.toFixed(1) : '0'}%`,
      color: "border-amber-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((card) => (
        <div 
          key={card.id} 
          className={`bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-4 border-l-8 ${card.color} ${onCardClick ? 'cursor-pointer hover:shadow-xl hover:scale-105 transition-transform' : ''}`}
          onClick={() => onCardClick && onCardClick(card.id)}
        >
          {card.icon}
          <div>
            <p className="text-gray-500 text-sm font-medium">{card.label}</p>
            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
