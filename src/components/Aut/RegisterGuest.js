import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from "../Api/Api";
import Styles from './LogIn.module.css';

const RegisterGuest = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    avatar: { url: '', alt: '' },
    banner: { url: '', alt: '' },
    venueManager: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);

const handleRegister = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');
  
  
  if (formData.password.length < 8) {
    setError('Passordet må være minst 8 tegn langt');
    setIsLoading(false);
    return;
  }
  
  if (!formData.email.includes('@stud.noroff.no')) {
    setError('Email må være en gyldig Noroff student email (@stud.noroff.no)');
    setIsLoading(false);
    return;
  }
  
  try {
    const userData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    };

   
    if (formData.venueManager) {
      userData.venueManager = true;
    }

    console.log('Sending userData:', userData); // Debug log
    
    const response = await authAPI.register(userData);
    console.log('Registration successful:', response);
    setSuccess(true);
    setRegisteredUser(response.data);
    
  } catch (error) {
    console.error('Registration failed:', error);
    
    
    if (error.message.includes('400')) {
      setError('Registration failed. Please check that all fields are filled out correctly and that the email is valid.');
    } else if (error.message.includes('409')) {
      setError('A user with this email or username already exists.');
    } else {
      setError('Registration failed. Please try again later.');
    }
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
            <h2 className="card-title text-success mb-3">Registration Successful!</h2>
            <p className="card-text mb-4">
              Welcome, <strong>{registeredUser?.name || formData.name}</strong>! 
              Your account is now created and you can log in.
            </p>
            <Link to="/login" className="btn btn-primary btn-lg">
              Log in now
            </Link>
            <div className="mt-3">
              <Link to="/" className="text-muted">
                Back to homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4" style={{maxWidth: '900px', width: '100%'}}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4 fw-light">Sign up</h2>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <form onSubmit={handleRegister}>
            <div className="mb-3">
  <input
    type="text"
    className={`${Styles['form-input']} form-control rounded-pill`}
    placeholder="Username (letters, numbers, and underscores only)"
    value={formData.name}
    onChange={(e) => setFormData({...formData, name: e.target.value})}
    pattern="[a-zA-Z0-9_]+"
    required
  />
</div>

<div className="mb-3">
  <input
    type="email"
    className={`${Styles['form-input']} form-control rounded-pill`}
    placeholder="Email (must end with @stud.noroff.no)"
    value={formData.email}
    onChange={(e) => setFormData({...formData, email: e.target.value})}
    pattern=".*@stud\.noroff\.no$"
    required
  />
</div>

<div className="mb-3">
  <input
    type="password"
    className={`${Styles['form-input']} form-control rounded-pill`}
    placeholder="Password (at least 8 characters)"
    value={formData.password}
    onChange={(e) => setFormData({...formData, password: e.target.value})}
    minLength="8"
    required
  />
</div>
            
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="venueManager"
                checked={formData.venueManager}
                onChange={(e) => setFormData({...formData, venueManager: e.target.checked})}
              />
              <label className="form-check-label" htmlFor="venueManager">
                Register as a venue manager
              </label>
            </div>
            <div className="text-center">
                 <button
              type="submit"
              className={`btn w-25 rounded-pill ${Styles.signInButton} ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Registrerer...' : 'Create'}
            </button> 
            </div>
          </form>
          
          <div className="text-center mt-3">
            <Link to="/login" className="text-muted">
              Already have an account? Log in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterGuest;