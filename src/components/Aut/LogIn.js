import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Styles from './LogIn.module.css';

const Login = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(formData);
    
    if (result.success) {
      // Redirect basert på brukerrolle
      if (result.user.venueManager) {
        navigate('/venue-manager-dashboard');
      } else {
        navigate('/'); // Tilbake til homepage for kunder
      }
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4" style={{maxWidth: '400px', width: '100%'}}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4 fw-light">Log in</h2>

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