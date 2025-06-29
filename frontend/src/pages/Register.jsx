import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

const registerSchema = Yup.object().shape({
  firstname: Yup.string()
    .min(2, 'Le prénom doit faire au moins 2 caractères')
    .required('Le prénom est requis'),
  lastname: Yup.string()
    .min(2, 'Le nom doit faire au moins 2 caractères')
    .required('Le nom est requis'),
  email: Yup.string()
    .email('Adresse email invalide')
    .required('L\'email est requis'),
  phone: Yup.string()
    .min(6, 'Le téléphone doit faire au moins 6 chiffres')
    .required('Le téléphone est requis'),
  password: Yup.string()
    .min(6, 'Le mot de passe doit faire au moins 6 caractères')
    .required('Le mot de passe est requis'),
  role: Yup.string()
    .oneOf(['conducteur', 'expediteur'], 'Veuillez sélectionner un rôle')
    .required('Le rôle est requis'),
});

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    password: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    registerSchema.validate(formData, { abortEarly: false })
      .then(() => setErrors({}))
      .catch(err => {
        const validationErrors = err.inner.reduce((acc, error) => {
          acc[error.path] = error.message;
          return acc;
        }, {});
        setErrors(validationErrors);
      });
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setLoading(true);

    try {
      await registerSchema.validate(formData, { abortEarly: false });
      const result = await register(formData);
      if (result.success) {
        toast.success('Inscription réussie ! Connectez-vous.');
        navigate('/login');
      } else {
        toast.error(result.message || 'Une erreur est survenue lors de l\'inscription.');
      }
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors = err.inner.reduce((acc, error) => {
          acc[error.path] = error.message;
          return acc;
        }, {});
        setErrors(validationErrors);
        toast.error('Veuillez corriger les erreurs du formulaire.');
      } else {
        toast.error(err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription.');
      }
    }
    setLoading(false);
  };

  const isFormValid = Object.keys(errors).length === 0 && Object.values(formData).every(v => v !== '');

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf6e3]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-[#2a6f97]">Créer un compte</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input name="firstname" type="text" value={formData.firstname} onChange={handleChange} placeholder="Prénom" className={`w-full px-4 py-3 rounded-lg bg-gray-100 border ${errors.firstname ? 'border-red-500' : 'border-gray-100'}`} />
            {errors.firstname && <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>}
          </div>
          <div>
            <input name="lastname" type="text" value={formData.lastname} onChange={handleChange} placeholder="Nom" className={`w-full px-4 py-3 rounded-lg bg-gray-100 border ${errors.lastname ? 'border-red-500' : 'border-gray-100'}`} />
            {errors.lastname && <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>}
          </div>
          <div>
            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Adresse email" className={`w-full px-4 py-3 rounded-lg bg-gray-100 border ${errors.email ? 'border-red-500' : 'border-gray-100'}`} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <input name="phone" type="text" value={formData.phone} onChange={handleChange} placeholder="Téléphone" className={`w-full px-4 py-3 rounded-lg bg-gray-100 border ${errors.phone ? 'border-red-500' : 'border-gray-100'}`} />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
          <div>
            <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Mot de passe" className={`w-full px-4 py-3 rounded-lg bg-gray-100 border ${errors.password ? 'border-red-500' : 'border-gray-100'}`} />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          <div>
            <select name="role" value={formData.role} onChange={handleChange} className={`w-full px-4 py-3 rounded-lg bg-gray-100 border ${errors.role ? 'border-red-500' : 'border-gray-100'}`}>
              <option value="" disabled>-- Sélectionnez un rôle --</option>
              <option value="conducteur">Conducteur</option>
              <option value="expediteur">Expéditeur</option>
            </select>
            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
          </div>
          <button type="submit" disabled={!isFormValid || loading} className="w-full mt-4 bg-[#c1272d] hover:bg-opacity-90 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-transform duration-200 hover:scale-105 disabled:bg-gray-400 disabled:scale-100">
            {loading ? 'Création en cours...' : 'S\'inscrire'}
          </button>
        </form>
        <p className="text-center text-sm">
          Déjà un compte ? <Link to="/login" className="font-medium text-[#2a6f97] hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
