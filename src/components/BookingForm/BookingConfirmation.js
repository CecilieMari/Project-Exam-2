import React from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import Style from './BookingForm.module.css';

const BookingConfirmation = () => {
  const location = useLocation();
  const { bookingId } = useParams();
  
  console.log('BookingConfirmation mounted');
  console.log('bookingId:', bookingId);
  console.log('location.state:', location.state);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card">
            <div className={`${Style.cardHeader} bg-transparent text-center border-0`}>
              <h2 className="mb-0">Booking details</h2>
            </div>
            <div className="card-body">
              <p className="card-text mb-4">
                Thank you for booking with Holidaze.
                Your stay at {location.state?.venue?.name} has been successfully confirmed.
              </p>

              {location.state && (
                <div>
                  {location.state.booking && (
                    <div className="card mb-4 border-0">
                      <div className="card-body border-0">
                        <div className="row">
                          {/* VENSTRE KOLONNE - Labels */}
                          <div className="col-md-6">
                            <p><strong>Guest Name:</strong></p>
                            <p><strong>Venue Name:</strong></p>
                            <p><strong>Check-in:</strong></p>
                            <p><strong>Check-out:</strong></p>
                            <p><strong>Guests:</strong></p>
                            <p><strong>Booking Reference:</strong></p>
                            <p><strong><i className="far fa-envelope me-2"></i>E-mail:</strong></p>
                          </div>
                          
                          {/* HØYRE KOLONNE - Values */}
                          <div className="col-md-6">
                            <p>{location.state.user?.name}</p>
                            <p>{location.state.venue?.name}</p>
                            <p>{new Date(location.state.booking?.dateFrom).toLocaleDateString()}</p>
                            <p>{new Date(location.state.booking?.dateTo).toLocaleDateString()}</p>
                            <p>{location.state.booking?.guests}</p>
                            <p>{bookingId}</p>
                            <p>{location.state.user?.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="text-start mb-4">
                <p className="mb-2">
                  <strong>We look forward to welcoming you to {location.state?.venue?.name || 'your chosen venue'}!</strong>
                </p>
                <p className="mb-0">
                  If you have any questions, please contact {location.state?.venue?.name || 'the hotel'} directly.
                </p>
              </div>

              <div className={`${Style.buttonGroup}`}>
                <Link to="/profile" className={`${Style.btn} btn text-decoration-none`}>
                  View My Bookings
                </Link>
                <Link to="/venues" className={`${Style.btn} btn text-decoration-none`}>
                  Browse More Venues
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
