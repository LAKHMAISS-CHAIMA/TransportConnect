import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as Yup from 'yup';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Adresse email invalide')
    .required('L\'email est requis'),
  password: Yup.string()
    .required('Le mot de passe est requis'),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loginSchema.validate(formData, { abortEarly: false })
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
      await loginSchema.validate(formData, { abortEarly: false });
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors = err.inner.reduce((acc, error) => {
          acc[error.path] = error.message;
          return acc;
        }, {});
        setErrors(validationErrors);
      } else {
        setServerError(err.response?.data?.message || 'Email ou mot de passe incorrect.');
      }
    }
    setLoading(false);
  };

  const isFormValid = Object.keys(errors).length === 0 && formData.email !== '' && formData.password !== '';

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf6e3]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-[#2a6f97]">Se connecter</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Adresse email" className={`w-full px-4 py-3 rounded-lg bg-gray-100 border ${errors.email ? 'border-red-500' : 'border-gray-100'}`} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Mot de passe" className={`w-full px-4 py-3 rounded-lg bg-gray-100 border ${errors.password ? 'border-red-500' : 'border-gray-100'}`} />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {serverError && <p className="text-red-500 text-sm text-center">{serverError}</p>}

          <button type="submit" disabled={!isFormValid || loading} className="w-full mt-4 bg-[#c1272d] hover:bg-opacity-90 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-transform duration-200 hover:scale-105 disabled:bg-gray-400 disabled:scale-100">
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center text-sm">
          Pas encore de compte ? <Link to="/register" className="font-medium text-[#2a6f97] hover:underline">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
}
