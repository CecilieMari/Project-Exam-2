import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from "../Api/Api";
import Styles from './LogIn.module.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', formData);
      const response = await authAPI.login(formData);
      console.log('Login successful:', response);
      
  
      window.dispatchEvent(new Event('storage'));
      
  
      setTimeout(() => {
        const savedToken = localStorage.getItem('accessToken');
        const savedUser = localStorage.getItem('user');
        
        if (savedToken && savedUser) {
          console.log('Data confirmed in localStorage, redirecting...');
          navigate('/my-bookings');
        } else {
          console.error('Data missing from localStorage');
          setError('Failed to save login data. Please try again.');
        }
      }, 100);
      
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${Styles.formContainer} container-fluid d-flex justify-content-center align-items-center min-vh-100`}>
      <div className={`card p-4 ${Styles.card}`} style={{maxWidth: '900px', width: '100%'}}>
        <div className="card-body">
          <h2 className={`${Styles.cardTitle} text-center mb-4 fw-light`}>Sign in</h2>
          <p>cemis@stud.noroff.no', password: '12345678900'</p>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className={`${Styles.formControl}`}>
            <div className="mb-3">
              <input
                type="email"
                className={`form-control rounded-pill ${Styles['form-input']}`}
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                autoComplete="email"
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                className={`form-control rounded-pill ${Styles['form-input']}`}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className={`btn w-25 rounded-pill ${Styles.signInButton} ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Sign in'}
            </button>
          </form>

          <div className="text-center mt-3">
            <Link to="/register" className="text-muted">
              Don't have an account? Sign up here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;