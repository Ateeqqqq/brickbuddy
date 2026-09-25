import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

function validateRegister(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Full name is required.';
  if (!form.email.trim()) errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address.';
  if (!form.phone.trim()) errors.phone = 'Phone number is required.';
  else if (!/^[+\d][\d\s-]{7,}$/.test(form.phone.trim())) errors.phone = 'Enter a valid phone number.';
  if (!form.password) errors.password = 'Password is required.';
  else if (form.password.length < 8) errors.password = 'Password must be at least 8 characters.';
  if (form.confirmPassword !== form.password) errors.confirmPassword = 'Passwords do not match.';
  if (!form.terms) errors.terms = 'Accept the terms to create an account.';
  return errors;
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', terms: false });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    const validationErrors = validateRegister(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    setLoading(true);
    setServerError('');
    try {
      await register(form);
      navigate('/account', { replace: true });
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
            <p className="section-label">Join the marketplace</p>
            <h1>Create your account</h1>
            <p>Save products, manage orders, and build with confidence.</p>
          </header>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {serverError && <div className="auth-server-error" role="alert">{serverError}</div>}
            <div className="auth-field">
              <label htmlFor="register-name">Full name</label>
              <input id="register-name" name="name" value={form.name} onChange={updateField} aria-invalid={Boolean(errors.name)} autoComplete="name" />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
            <div className="auth-field">
              <label htmlFor="register-email">Email</label>
              <input id="register-email" name="email" type="email" value={form.email} onChange={updateField} aria-invalid={Boolean(errors.email)} autoComplete="email" />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
            <div className="auth-field">
              <label htmlFor="register-phone">Phone</label>
              <input id="register-phone" name="phone" type="tel" value={form.phone} onChange={updateField} aria-invalid={Boolean(errors.phone)} autoComplete="tel" />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>
            <div className="auth-field">
              <label htmlFor="register-password">Password</label>
              <div className="auth-input-wrap">
                <input id="register-password" name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={updateField} aria-invalid={Boolean(errors.password)} autoComplete="new-password" />
                <button type="button" className="password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>
            <div className="auth-field">
              <label htmlFor="register-confirm-password">Confirm password</label>
              <div className="auth-input-wrap">
                <input id="register-confirm-password" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={updateField} aria-invalid={Boolean(errors.confirmPassword)} autoComplete="new-password" />
                <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword((visible) => !visible)} aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>
                  {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
            </div>
            <label className="auth-checkbox">
              <input name="terms" type="checkbox" checked={form.terms} onChange={updateField} aria-invalid={Boolean(errors.terms)} />
              I agree to BrickBuddy’s terms and privacy policy.
            </label>
            {errors.terms && <span className="field-error">{errors.terms}</span>}
            <button className="btn-primary auth-submit" type="submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?
            <Link className="auth-link" to="/login">Login</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
