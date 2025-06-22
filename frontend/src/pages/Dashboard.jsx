import React from 'react';
import DashboardStats from '../components/DashboardStats';
import CreateAnnonceForm from '../components/CreateAnnonceForm';

const Dashboard = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
      <DashboardStats />
      <div className="mt-10">
        <CreateAnnonceForm />
      </div>
    </div>
  );
};

export default Dashboard;
