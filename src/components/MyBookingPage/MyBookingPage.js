import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Styles from './MyBookingPage.module.css';

const MyBookingPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newAvatar, setNewAvatar] = useState('');
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }
    
    fetchUserData();
    fetchUserBookings();
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load user data');
    }
  };

  const fetchUserBookings = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('https://v2.api.noroff.dev/holidaze/profiles/' + JSON.parse(localStorage.getItem('user')).name + '/bookings?_venue=true', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Noroff-API-Key': 'bffb1d1f-dc02-40ef-80e1-4446b9acc60a'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBookings(data.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  // ERSTATT HELE updateAvatar FUNKSJONEN MED DENNE:
  const updateAvatar = async (e) => {
    e.preventDefault();
    if (!newAvatar) return;

    // Valider URL format
    if (!newAvatar.match(/\.(jpeg|jpg|gif|png)$/i)) {
      alert('Please use a direct link to an image file (must end with .jpg, .png, .gif, etc.)');
      return;
    }

    setIsUpdatingAvatar(true);
    try {
      const token = localStorage.getItem('accessToken');
      const userName = user.name;
      
      console.log('=== Avatar Update Debug ===');
      console.log('User:', userName);
      console.log('Avatar URL:', newAvatar);
      console.log('Token exists:', !!token);
      console.log('Token:', token?.substring(0, 20) + '...');
      
      const response = await fetch(`https://v2.api.noroff.dev/holidaze/profiles/${userName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Noroff-API-Key': 'bffb1d1f-dc02-40ef-80e1-4446b9acc60a'
        },
        body: JSON.stringify({
          avatar: {
            url: newAvatar,
            alt: `${user.name}'s avatar`
          }
        })
      });

      console.log('Response status:', response.status);
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          errorData = { message: responseText };
        }
        console.error('API Error:', errorData);
        throw new Error(errorData.errors?.[0]?.message || errorData.message || `HTTP error! status: ${response.status}`);
      }

      const updatedUser = JSON.parse(responseText);
      console.log('Updated user data:', updatedUser);
      
      // Oppdater state og localStorage
      setUser(updatedUser.data);
      localStorage.setItem('user', JSON.stringify(updatedUser.data));
      setNewAvatar('');
      
      // Trigger navigation update
      window.dispatchEvent(new Event('storage'));
      
      alert('Avatar updated successfully!');
      
    } catch (error) {
      console.error('=== Avatar Update Error ===');
      console.error('Error details:', error);
      console.error('Error message:', error.message);
      alert(`Failed to update avatar: ${error.message}`);
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/');
  };

  const getCurrentBookings = () => {
    const today = new Date();
    return bookings.filter(booking => new Date(booking.dateTo) >= today);
  };

  const getPastBookings = () => {
    const today = new Date();
    return bookings.filter(booking => new Date(booking.dateTo) < today);
  };

  if (loading) {
    return (
      <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
        <div className="alert alert-danger">User data not found</div>
      </div>
    );
  }

  return (
    <div className={`${Styles.dashboard} container-fluid py-4`}>
      <div className="container">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="h2">My Dashboard</h1>
              <button onClick={logout} className="btn btn-outline-secondary">
                Logout
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* User Profile Section */}
        <div className="row mb-5">
          <div className="col-lg-4 col-md-6">
            <div className="card h-100">
              <div className="card-body text-center">
                <div className={Styles.avatarSection}>
                  <img
                    src={user.avatar?.url || 'https://via.placeholder.com/150'}
                    alt={user.name}
                    className={`${Styles.avatar} rounded-circle mb-3`}
                  />
                  <h4 className="card-title">{user.name}</h4>
                  <p className="text-muted">{user.email}</p>
                </div>

                <form onSubmit={updateAvatar} className="mt-4">
                  <div className="mb-3">
                    <label className="form-label">Update Avatar URL:</label>
                    <input
                      type="url"
                      className="form-control"
                      value={newAvatar}
                      onChange={(e) => setNewAvatar(e.target.value)}
                      placeholder="https://example.com/your-image.jpg"
                    />
                    <div className="form-text">
                      <small>
                        <strong>Must be a direct link to the image (ends with .jpg, .png, etc.)</strong>
                      </small>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isUpdatingAvatar || !newAvatar}
                  >
                    {isUpdatingAvatar ? 'Updating...' : 'Update Avatar'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-8 col-md-6">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Account Statistics</h5>
                <div className="row text-center">
                  <div className="col-4">
                    <div className="border-end">
                      <h3 className="text-primary">{bookings.length}</h3>
                      <small className="text-muted">Total Bookings</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="border-end">
                      <h3 className="text-success">{getCurrentBookings().length}</h3>
                      <small className="text-muted">Active Bookings</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <h3 className="text-warning">{getPastBookings().length}</h3>
                    <small className="text-muted">Past Bookings</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Bookings */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Current & Upcoming Bookings</h5>
              </div>
              <div className="card-body">
                {getCurrentBookings().length === 0 ? (
                  <p className="text-muted text-center py-4">No current bookings</p>
                ) : (
                  <div className="row">
                    {getCurrentBookings().map((booking) => (
                      <div key={booking.id} className="col-lg-6 col-md-12 mb-3">
                        <div className="card border-success">
                          <div className="card-body">
                            <h6 className="card-title">{booking.venue?.name || 'Venue Name'}</h6>
                            <p className="card-text">
                              <strong>Check-in:</strong> {new Date(booking.dateFrom).toLocaleDateString()}<br />
                              <strong>Check-out:</strong> {new Date(booking.dateTo).toLocaleDateString()}<br />
                              <strong>Guests:</strong> {booking.guests}
                            </p>
                            <span className="badge bg-success">Active</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Past Bookings */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Past Bookings</h5>
              </div>
              <div className="card-body">
                {getPastBookings().length === 0 ? (
                  <p className="text-muted text-center py-4">No past bookings</p>
                ) : (
                  <div className="row">
                    {getPastBookings().map((booking) => (
                      <div key={booking.id} className="col-lg-6 col-md-12 mb-3">
                        <div className="card border-secondary">
                          <div className="card-body">
                            <h6 className="card-title">{booking.venue?.name || 'Venue Name'}</h6>
                            <p className="card-text">
                              <strong>Check-in:</strong> {new Date(booking.dateFrom).toLocaleDateString()}<br />
                              <strong>Check-out:</strong> {new Date(booking.dateTo).toLocaleDateString()}<br />
                              <strong>Guests:</strong> {booking.guests}
                            </p>
                            <span className="badge bg-secondary">Completed</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookingPage;