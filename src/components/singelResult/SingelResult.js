import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Style from "./SingelResult.module.css";

function SingleResult() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // Kalender state
    const [selectedDates, setSelectedDates] = useState([null, null]);
    const [bookedDates, setBookedDates] = useState([]);

    console.log('Venue ID:', id);

    // Fetch venue data basert på ID
    useEffect(() => {
        const fetchVenue = async () => {
            try {
                setLoading(true);
                const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${id}?_bookings=true&_owner=true`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch venue');
                }
                
                const data = await response.json();
                console.log('Venue data:', data.data);
                console.log('Bookings:', data.data.bookings);
                setVenue(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchVenue();
        }
    }, [id]);

    // Prosesser bookings til opptatte datoer
    useEffect(() => {
        if (venue?.bookings) {
            const occupied = [];
            venue.bookings.forEach(booking => {
                const start = new Date(booking.dateFrom);
                const end = new Date(booking.dateTo);
                
                for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
                    occupied.push(new Date(date));
                }
            });
            setBookedDates(occupied);
            console.log('Booked dates:', occupied);
        }
    }, [venue]);

    // Kalender funksjoner
    const isDateBooked = (date) => {
        return bookedDates.some(bookedDate => 
            bookedDate.toDateString() === date.toDateString()
        );
    };

    const isDateDisabled = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today || isDateBooked(date);
    };

    const handleDateChange = (value) => {
        setSelectedDates(value);
        console.log('Selected dates:', value);
    };

    const getTileClassName = ({ date, view }) => {
        if (view === 'month') {
            if (isDateBooked(date)) {
                return Style.bookedDate;
            }
            if (selectedDates[0] && selectedDates[1]) {
                if (date >= selectedDates[0] && date <= selectedDates[1]) {
                    return Style.selectedRange;
                }
            }
        }
        return null;
    };

    const calculateNights = () => {
        if (selectedDates[0] && selectedDates[1]) {
            const timeDiff = selectedDates[1] - selectedDates[0];
            return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        }
        return 0;
    };

    const calculateTotal = () => {
        return venue.price * calculateNights();
    };

    // Image navigation
    const nextImage = () => {
        if (venue?.media && venue.media.length > 1) {
            setCurrentImageIndex((prev) => 
                prev === venue.media.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = () => {
        if (venue?.media && venue.media.length > 1) {
            setCurrentImageIndex((prev) => 
                prev === 0 ? venue.media.length - 1 : prev - 1
            );
        }
    };

    if (loading) {
        return (
            <div className={Style.loading}>
                <div className={Style.spinner}></div>
                <p>Loading venue details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={Style.error}>
                <h3>Something went wrong</h3>
                <p>Error: {error}</p>
                <button onClick={() => navigate(-1)} className={Style.backButton}>
                    Go Back
                </button>
            </div>
        );
    }

    if (!venue) {
        return (
            <div className={Style.notFound}>
                <h3>Venue not found</h3>
                <p>The venue you're looking for doesn't exist.</p>
                <button onClick={() => navigate('/')} className={Style.homeButton}>
                    Go Home
                </button>
            </div>
        );
    }

    return (
        <div className={`${Style.singelResult} container-fluid`}>
            {/* Navigation */}
            <div className="row mb-3">
                <div className="col-12">
                    <button onClick={() => navigate(-1)} className="btn btn-outline-secondary">
                        ← Back
                    </button>
                </div>
            </div>

            {/* Title */}
            <div className="row mb-4">
                <div className="col-12 text-center">
                    <h1 className={Style.venueName}>{venue.name}</h1>
                </div>
            </div>

            {/* Image and Calendar Row */}
            <div className="row mb-4">
                {/* Image Gallery - gjort bredere */}
                <div className="col-lg-8 col-md-12 mb-3">
                    <div className={Style.imageSection}>
                        {venue.media && venue.media.length > 0 ? (
                            <div className={Style.imageGallery}>
                                <img
                                    src={venue.media[currentImageIndex].url}
                                    alt={venue.media[currentImageIndex].alt || venue.name}
                                    className={`${Style.mainImage} img-fluid`}
                                />
                                
                                {venue.media.length > 1 && (
                                    <>
                                        <button 
                                            onClick={prevImage}
                                            className={`${Style.imageNav} ${Style.prevButton}`}
                                        >
                                            ‹
                                        </button>
                                        <button 
                                            onClick={nextImage}
                                            className={`${Style.imageNav} ${Style.nextButton}`}
                                        >
                                            ›
                                        </button>
                                        <div className={Style.imageIndicators}>
                                            {venue.media.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentImageIndex(index)}
                                                    className={`${Style.indicator} ${
                                                        index === currentImageIndex ? Style.active : ''
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className={`${Style.noImage} d-flex align-items-center justify-content-center`}>
                                <span>No images available</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Calendar - gjort smalere */}
                <div className="col-lg-4 col-md-12">
                    <div className={`${Style.calendarSection} card h-100`}>
                        <div className="card-body">
                            <h3 className={Style.calendarTitle}>Available dates</h3>
                            
                            <Calendar
                                onChange={handleDateChange}
                                value={selectedDates}
                                selectRange={true}
                                tileDisabled={({ date }) => isDateDisabled(date)}
                                tileClassName={getTileClassName}
                                minDate={new Date()}
                                className={`${Style.calendar} w-100`}
                            />
                            
                            {selectedDates[0] && selectedDates[1] && (
                                <div className={`${Style.selectionSummary} mt-3 p-3 bg-light rounded`}>
                                    <p className="mb-1"><strong>Check-in:</strong> {selectedDates[0].toLocaleDateString()}</p>
                                    <p className="mb-1"><strong>Check-out:</strong> {selectedDates[1].toLocaleDateString()}</p>
                                    <p className="mb-1"><strong>Nights:</strong> {calculateNights()}</p>
                                    <p className="mb-0"><strong>Total:</strong> ${calculateTotal()}</p>
                                </div>
                            )}

                            <div className={`${Style.legend} d-flex flex-wrap mt-3`}>
                                <div className={`${Style.legendItem} d-flex align-items-center me-2 mb-2`}>
                                    <div className={Style.availableColor}></div>
                                    <span className="ms-1 small">Available</span>
                                </div>
                                <div className={`${Style.legendItem} d-flex align-items-center me-2 mb-2`}>
                                    <div className={Style.bookedColor}></div>
                                    <span className="ms-1 small">Booked</span>
                                </div>
                                <div className={`${Style.legendItem} d-flex align-items-center mb-2`}>
                                    <div className={Style.selectedColor}></div>
                                    <span className="ms-1 small">Selected</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Row */}
            <div className="row">
                {/* Main Content */}
                <div className="col-lg-8 col-md-12">
                    {/* Venue Info */}
                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <span className="h4 text-primary">${venue.price}</span>
                                    <span className="text-muted"> per night</span>
                                </div>
                                <div>
                                    <span className="badge bg-secondary">👥 Max {venue.maxGuests} guests</span>
                                </div>
                            </div>

                            {/* Location */}
                            {venue.location && (venue.location.city || venue.location.country) && (
                                <p className="text-muted mb-3">
                                    📍 {[venue.location.city, venue.location.country]
                                        .filter(Boolean)
                                        .join(', ')
                                    }
                                </p>
                            )}

                            {/* Description */}
                            {venue.description && (
                                <div className="mb-4">
                                    <h5>About this place</h5>
                                    <p>{venue.description}</p>
                                </div>
                            )}

                            {/* Amenities */}
                            {venue.meta && (
                                <div className="mb-4">
                                    <h5>What this place offers</h5>
                                    <div className="row">
                                        {venue.meta.wifi && (
                                            <div className="col-sm-6 mb-2">
                                                <span className="me-2">📶</span>WiFi
                                            </div>
                                        )}
                                        {venue.meta.parking && (
                                            <div className="col-sm-6 mb-2">
                                                <span className="me-2">🚗</span>Free parking
                                            </div>
                                        )}
                                        {venue.meta.breakfast && (
                                            <div className="col-sm-6 mb-2">
                                                <span className="me-2">🥐</span>Breakfast included
                                            </div>
                                        )}
                                        {venue.meta.pets && (
                                            <div className="col-sm-6 mb-2">
                                                <span className="me-2">🐕</span>Pets allowed
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Owner info */}
                            {venue.owner && (
                                <div>
                                    <h5>Hosted by {venue.owner.name}</h5>
                                    {venue.owner.email && (
                                        <p className="text-muted">Contact: {venue.owner.email}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Booking Sidebar */}
                <div className="col-lg-4 col-md-12">
                    <div className="card sticky-top">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="h4 text-primary">${venue.price}</span>
                                <span className="text-muted">per night</span>
                            </div>
                            
                            {selectedDates[0] && selectedDates[1] && (
                                <div className="bg-light p-3 rounded mb-3">
                                    <p className="mb-1 small"><strong>Check-in:</strong> {selectedDates[0].toLocaleDateString()}</p>
                                    <p className="mb-1 small"><strong>Check-out:</strong> {selectedDates[1].toLocaleDateString()}</p>
                                    <p className="mb-0 small"><strong>Total:</strong> ${calculateTotal()}</p>
                                </div>
                            )}
                            
                            <button 
                                className={`btn w-100 mb-3 ${selectedDates[0] && selectedDates[1] ? 'btn-primary' : 'btn-outline-secondary'}`}
                                disabled={!selectedDates[0] || !selectedDates[1]}
                                onClick={() => {
                                    if (selectedDates[0] && selectedDates[1]) {
                                        navigate(`/booking/${venue.id}`, {
                                            state: {
                                                checkIn: selectedDates[0],
                                                checkOut: selectedDates[1],
                                                totalPrice: calculateTotal(),
                                                nights: calculateNights()
                                            }
                                        });
                                    }
                                }}
                            >
                                {selectedDates[0] && selectedDates[1] ? 'Reserve Now' : 'Select Dates First'}
                            </button>
                            
                            <p className="text-muted text-center small mb-0">
                                You won't be charged yet
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SingleResult;