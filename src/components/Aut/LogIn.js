import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from "../Api/Api";
import Styles from './LogIn.module.css';


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData);
      console.log('Login successful:', response);
      setSuccess(true);
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
        <div className="card p-4 text-center" style={{maxWidth: '400px'}}>
          <div className="card-body">
            <div className="mb-3">
              <i className="fas fa-check-circle text-success" style={{fontSize: '3rem'}}></i>
            </div>
            <h2 className="card-title text-success mb-3">Login Successful!</h2>
            <p className="card-text mb-4">
              Welcome back, <strong>{formData.email}</strong>! You are now logged in.
            </p>
            <Link to="/" className="btn btn-primary btn-lg">
              Go to homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${Styles.formContainer} container-fluid d-flex justify-content-center align-items-center min-vh-100`}>
      <div className={`card p-4 ${Styles.card}`} style={{maxWidth: '900px', width: '100%'}}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4 fw-light">Sign in</h2>

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
    