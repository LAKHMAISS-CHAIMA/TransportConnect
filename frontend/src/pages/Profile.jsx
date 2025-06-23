import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaShieldAlt, FaStar, FaBox, FaRoute, FaPaperPlane, FaCheckCircle, FaBan, FaUser, FaPhone, FaEnvelope, FaUserTag, FaUserEdit, FaSave, FaTimes } from 'react-icons/fa';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 py-2 border-b last:border-b-0">
    <span className="text-[#2a6f97] text-lg">{icon}</span>
    <span className="font-semibold w-32">{label}</span>
    <span className="text-gray-800">{value}</span>
  </div>
);

const profileSchema = Yup.object().shape({
  firstname: Yup.string().min(2, 'Le prénom doit faire au moins 2 caractères').required('Le prénom est requis'),
  lastname: Yup.string().min(2, 'Le nom doit faire au moins 2 caractères').required('Le nom est requis'),
  email: Yup.string().email('Adresse email invalide').required('L\'email est requis'),
  phone: Yup.string().min(6, 'Le téléphone doit faire au moins 6 chiffres').required('Le téléphone est requis'),
});

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [loading, setLoading] = useState(false);

  if (!user) return <div className="text-center mt-10">Chargement...</div>;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    setFormData({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await profileSchema.validate(formData, { abortEarly: false });
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/users/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Profil mis à jour !');
      setEditMode(false);
      window.location.reload(); 
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        toast.error(err.errors[0]);
      } else {
        toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour du profil.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-8 space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#2a6f97] flex items-center gap-2"><FaUser className="inline" /> Informations personnelles</h2>
          {!editMode && <button onClick={handleEdit} className="flex items-center gap-2 px-3 py-1 bg-[#2a6f97] text-white rounded hover:bg-opacity-90"><FaUserEdit /> Modifier</button>}
        </div>
        <div className="bg-[#f6f8fa] rounded-lg p-4 divide-y">
          {editMode ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Prénom</label>
                  <input name="firstname" value={formData.firstname} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Nom</label>
                  <input name="lastname" value={formData.lastname} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Email</label>
                  <input name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Téléphone</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button type="submit" disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"><FaSave /> Enregistrer</button>
                <button type="button" onClick={handleCancel} className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"><FaTimes /> Annuler</button>
              </div>
            </form>
          ) : (
            <>
              <InfoRow icon={<FaUser />} label="Prénom" value={user.firstname} />
              <InfoRow icon={<FaUser />} label="Nom" value={user.lastname} />
              <InfoRow icon={<FaEnvelope />} label="Email" value={user.email} />
              <InfoRow icon={<FaPhone />} label="Téléphone" value={user.phone} />
            </>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-[#2a6f97] mb-4 flex items-center gap-2"><FaUserTag className="inline" /> Statut du compte</h2>
        <div className="bg-[#f6f8fa] rounded-lg p-4 flex flex-wrap gap-4 items-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold text-sm"><FaUserTag /> {user.role}</span>
          {user.isVerified && <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800 font-semibold text-sm"><FaCheckCircle /> Vérifié</span>}
          {user.isBanned && <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 font-semibold text-sm"><FaBan /> Suspendu</span>}
          {user.badge && user.badge !== 'Aucun' && <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-sm"><FaShieldAlt /> {user.badge}</span>}
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 font-semibold text-sm"><FaRoute /> Statut : {user.status || 'N/A'}</span>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-[#2a6f97] mb-4 flex items-center gap-2"><FaStar className="inline" /> Statistiques</h2>
        <div className="bg-[#f6f8fa] rounded-lg p-4 flex flex-wrap gap-6">
          <div className="flex flex-col items-center">
            <FaStar className="text-yellow-400 text-2xl mb-1" />
            <span className="font-bold text-lg">{user.averageRating?.toFixed(2) || '0.00'}</span>
            <span className="text-xs text-gray-500">Note moyenne</span>
          </div>
          <div className="flex flex-col items-center">
            <FaBox className="text-[#2a6f97] text-2xl mb-1" />
            <span className="font-bold text-lg">{user.totalRatings || 0}</span>
            <span className="text-xs text-gray-500">Nombre d'évaluations</span>
          </div>
          <div className="flex flex-col items-center">
            <FaPaperPlane className="text-[#2a6f97] text-2xl mb-1" />
            <span className="font-bold text-lg">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
            <span className="text-xs text-gray-500">Compte créé le</span>
          </div>
          <div className="flex flex-col items-center">
            <FaPaperPlane className="text-[#2a6f97] text-2xl mb-1" />
            <span className="font-bold text-lg">{user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}</span>
            <span className="text-xs text-gray-500">Dernière modification</span>
          </div>
        </div>
      </div>
    </div>
  );
}
