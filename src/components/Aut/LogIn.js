import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; 
import { authAPI } from "../Api/Api";
import Styles from './LogIn.module.css';

const Login = () => {
  const navigate = useNavigate();
  const { checkLoginStatus } = useAuth(); 
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Attempting login with:', formData);
      const response = await authAPI.login(formData);
      console.log('Login successful:', response);
      
    
      if (checkLoginStatus) {
        checkLoginStatus();
      }
      
    
      window.dispatchEvent(new Event('storage'));
      
      
      setTimeout(() => {
        const savedToken = localStorage.getItem('accessToken');
        const savedUser = localStorage.getItem('user');
        
        if (savedToken && savedUser) {
          console.log('Data confirmed in localStorage, redirecting...');
          
          
          try {
            const user = JSON.parse(savedUser);
            if (user.venueManager) {
              navigate('/venue-manager-dashboard');
            } else {
              navigate('/my-bookings'); 
            }
          } catch (e) {
            navigate('/my-bookings'); 
          }
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
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4" style={{maxWidth: '400px', width: '100%'}}>
        <div className="card-body">
          <h2 className={`${Styles.cardTitle} text-center mb-4 fw-light`}>Sign in</h2>
          {/* Fjern denne test linjen: */}
          {/* <p>cemis@stud.noroff.no', password: '12345678900'</p> */}

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <input
                type="email"
                className={`${Styles['form-input']} form-control rounded-pill`}
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
                className={`${Styles['form-input']} form-control rounded-pill`}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                autoComplete="current-password"
                required
              />
            </div>
            
            <div className="text-center">
              <button
                type="submit"
                className={`btn w-50 rounded-pill ${Styles.signInButton}`}
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Log in'}
              </button>
            </div>
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