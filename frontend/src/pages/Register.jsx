import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as Yup from 'yup';

const registerSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Le nom doit faire au moins 3 caractères')
    .required('Le nom est requis'),
  email: Yup.string()
    .email('Adresse email invalide')
    .required('L\'email est requis'),
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
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: '' });
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
      await register(formData);
      navigate('/dashboard'); 
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors = err.inner.reduce((acc, error) => {
          acc[error.path] = error.message;
          return acc;
        }, {});
        setErrors(validationErrors);
      } else {
        setServerError(err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription.');
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
            <input name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Nom complet" className={`w-full px-4 py-3 rounded-lg bg-gray-100 border ${errors.name ? 'border-red-500' : 'border-gray-100'}`} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Adresse email" className={`w-full px-4 py-3 rounded-lg bg-gray-100 border ${errors.email ? 'border-red-500' : 'border-gray-100'}`} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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

          {serverError && <p className="text-red-500 text-sm text-center">{serverError}</p>}
          
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
