import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { LogIn, UserPlus } from 'lucide-react';

const LoginRegister = ({ userInfo, setUserInfo }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { data } = await api.post('/auth/login', { email, password });
        setUserInfo(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
      } else {
        const { data } = await api.post('/auth/register', { name, email, password });
        setUserInfo(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page container animate-fade-in">
      <div className="auth-container glass-panel">
        <div className="auth-tabs">
          <button
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`auth-tab-btn ${isLogin ? 'active' : ''}`}
          >
            <LogIn size={18} /> Login
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`auth-tab-btn ${!isLogin ? 'active' : ''}`}
          >
            <UserPlus size={18} /> Register
          </button>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="input-group">
              <label htmlFor="name-input">Full Name</label>
              <input
                id="name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="input-field"
                required
              />
            </div>
          )}

          <div className="input-group">
            <label htmlFor="email-input">Email Address</label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="input-field"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password-input">Password</label>
            <input
              id="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field"
              required
            />
          </div>

          {!isLogin && (
            <div className="input-group">
              <label htmlFor="confirm-password-input">Confirm Password</label>
              <input
                id="confirm-password-input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
                required
              />
            </div>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary btn-block auth-submit-btn">
            {loading ? 'Authenticating...' : isLogin ? 'Login Account' : 'Create Account'}
          </button>
        </form>
        
        <div className="auth-hint">
          {isLogin ? (
            <p>Don't have an account? <button onClick={() => setIsLogin(false)}>Sign up</button></p>
          ) : (
            <p>Already have an account? <button onClick={() => setIsLogin(true)}>Sign in</button></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
