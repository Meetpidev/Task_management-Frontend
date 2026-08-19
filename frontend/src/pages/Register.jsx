import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[.3rem] shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
        <input
          type="text"
          placeholder="Full Name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border rounded-md px-3 py-2 mb-3 text-sm"
        />
        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border rounded-md px-3 py-2 mb-3 text-sm"
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border rounded-md px-3 py-2 mb-4 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>
        <p className="text-sm text-center mt-4 text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-medium">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
