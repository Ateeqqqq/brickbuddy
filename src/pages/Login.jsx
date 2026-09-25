import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

function validateLogin(form) {
  const errors = {};
  if (!form.email.trim()) errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address.';
  if (!form.password) errors.password = 'Password is required.';
  else if (form.password.length < 8) errors.password = 'Password must be at least 8 characters.';
  return errors;
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setServerError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateLogin(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    setLoading(true);
    setServerError('');
    try {
      await login(form.email, form.password);
      navigate(location.state?.from || '/account', { replace: true });
    } catch (error) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="container">
        <section className="auth-card">
          <header className="auth-header">
            <p className="section-label">Welcome back</p>
            <h1>Sign in to BrickBuddy</h1>
            <p>Manage your materials, orders, and projects in one place.</p>
          </header>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {serverError && <div className="auth-server-error" role="alert">{serverError}</div>}
            <div className="auth-field">
              <label htmlFor="login-email">Email</label>
              <input id="login-email" name="email" type="email" value={form.email} onChange={updateField} aria-invalid={Boolean(errors.email)} autoComplete="email" />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
            <div className="auth-field">
              <label htmlFor="login-password">Password</label>
              <div className="auth-input-wrap">
                <input id="login-password" name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={updateField} aria-invalid={Boolean(errors.password)} autoComplete="current-password" />
                <button type="button" className="password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>
            <div className="auth-options">
              <label className="auth-checkbox">
                <input name="remember" type="checkbox" checked={form.remember} onChange={updateField} />
                Remember me
              </label>
              <Link className="auth-link" to="/login">Forgot password?</Link>
            </div>
            <button className="btn-primary auth-submit" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Login'}
            </button>
          </form>

          <div className="auth-footer">
            New to BrickBuddy?
            <Link className="auth-link" to="/register">Create an account</Link>
          </div>
          <div className="auth-footer auth-guest">
            <Link className="auth-link" to="/">Continue as guest</Link>
          </div>
          <p className="auth-demo-note">Customer demo: demo@brickbuddy.in / BrickBuddy123!<br />Vendor demo: vendor@brickbuddy.in / BrickBuddyVendor123!</p>
        </section>
      </div>
    </main>
  );
}
