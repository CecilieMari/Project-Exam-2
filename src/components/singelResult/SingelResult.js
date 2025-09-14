import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Style from "./SingelResult.module.css";

function SingleResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

 
  const [selectedDates, setSelectedDates] = useState([null, null]);
  const [bookedDates, setBookedDates] = useState([]);

  
  const [guests, setGuests] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState("");

  console.log("Venue ID:", id);

  
  useEffect(() => {
    const fetchVenue = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues/${id}?_bookings=true&_owner=true`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch venue");
        }

        const data = await response.json();
        console.log("Venue data:", data.data);
        console.log("Bookings:", data.data.bookings);
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

  
  useEffect(() => {
    if (venue?.bookings) {
      const occupied = [];
      venue.bookings.forEach((booking) => {
        const start = new Date(booking.dateFrom);
        const end = new Date(booking.dateTo);

        for (
          let date = new Date(start);
          date <= end;
          date.setDate(date.getDate() + 1)
        ) {
          occupied.push(new Date(date));
        }
      });
      setBookedDates(occupied);
      console.log("Booked dates:", occupied);
    }
  }, [venue]);

  
  const isDateBooked = (date) => {
    return bookedDates.some(
      (bookedDate) => bookedDate.toDateString() === date.toDateString()
    );
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today || isDateBooked(date);
  };

  const handleDateChange = (value) => {
    setSelectedDates(value);
    console.log("Selected dates:", value);
  };

  const getTileClassName = ({ date, view }) => {
    if (view === "month") {
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

 
  const handleDirectBooking = async () => {
    if (!selectedDates[0] || !selectedDates[1]) {
      setBookingError("Please select check-in and check-out dates");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    setIsBooking(true);
    setBookingError("");

    try {
      const response = await fetch(
        "https://v2.api.noroff.dev/holidaze/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": "bffb1d1f-dc02-40ef-80e1-4446b9acc60a",
          },
          body: JSON.stringify({
            dateFrom: selectedDates[0].toISOString().split("T")[0],
            dateTo: selectedDates[1].toISOString().split("T")[0],
            guests: parseInt(guests),
            venueId: id,
          }),
        }
      );

      if (response.ok) {
        const booking = await response.json();
        
        navigate(`/booking-confirmation/${booking.data.id}`, {
          state: {
            booking: booking.data,
            venue: venue,
            user: JSON.parse(localStorage.getItem("user")),
          },
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.errors?.[0]?.message || "Booking failed");
      }
    } catch (error) {
      setBookingError(error.message);
    } finally {
      setIsBooking(false);
    }
  };

  const calculateTotal = () => {
    if (selectedDates[0] && selectedDates[1] && venue) {
      const nights = Math.ceil(
        (selectedDates[1] - selectedDates[0]) / (1000 * 60 * 60 * 24)
      );
      return venue.price * nights;
    }
    return 0;
  };

 
  const calculateNights = () => {
    if (selectedDates[0] && selectedDates[1]) {
      return Math.ceil(
        (selectedDates[1] - selectedDates[0]) / (1000 * 60 * 60 * 24)
      );
    }
    return 0;
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
        <button onClick={() => navigate("/")} className={Style.homeButton}>
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
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline-secondary"
          >
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
                            index === currentImageIndex ? Style.active : ""
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div
                className={`${Style.noImage} d-flex align-items-center justify-content-center`}
              >
                <span>No images available</span>
              </div>
            )}
          </div>
        </div>

        {/* Calendar */}
        <div className="col-lg-4 col-md-12">
          <div className={`${Style.calendarSection} card h-100`}>
            <div className={`card-body ${Style.customBackground}`}>
              {/* Pris flyttes hit - over kalenderen */}
              <div
                className={`d-flex justify-content-between align-items-center mb-3 p-3  rounded`}
              >
                <div>
                  <span className="h4 text-primary">${venue.price}</span>
                  <span className="text-muted"> per night</span>
                </div>
                <div>
                  <span className={`badge ${Style.guestBadge}`}>
                    {" "}
                    Max {venue.maxGuests} guests
                  </span>
                </div>
              </div>

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
                <div className={`${Style.selectionSummary} mt-3 p-3 rounded`}>
                  <p className="mb-1">
                    <strong>Check-in:</strong>{" "}
                    {selectedDates[0].toLocaleDateString()}
                  </p>
                  <p className="mb-1">
                    <strong>Check-out:</strong>{" "}
                    {selectedDates[1].toLocaleDateString()}
                  </p>
                  <p className="mb-1">
                    <strong>Nights:</strong> {calculateNights()}
                  </p>
                  <p className="mb-0">
                    <strong>Total:</strong> ${calculateTotal()}
                  </p>
                </div>
              )}

              <div className={`${Style.legend} d-flex flex-wrap mt-3`}>
                <div
                  className={`${Style.legendItem} d-flex align-items-center me-2 mb-2`}
                >
                  <div className={Style.availableColor}></div>
                  <span className="ms-1 small">Available</span>
                </div>
                <div
                  className={`${Style.legendItem} d-flex align-items-center me-2 mb-2`}
                >
                  <div className={Style.bookedColor}></div>
                  <span className="ms-1 small">Booked</span>
                </div>
                <div
                  className={`${Style.legendItem} d-flex align-items-center mb-2`}
                >
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
        <div className="col-lg-8 col-md-12 d-flex justify-content-center">
          {/* Venue Info */}
          <div className={`${Style.card} mb-4`}>
            <div className={`${Style.cardBody}`}>
              {/* Fjernet prisseksjonen herfra siden den nå er over kalenderen */}

              {/* Location */}
              {venue.location &&
                (venue.location.city || venue.location.country) && (
                  <p className="text-muted mb-3">
                    📍{" "}
                    {[venue.location.city, venue.location.country]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}

              {/* Description */}
              {venue.description && (
                <div className="mb-4">
                  <h5>About this place</h5>
                  <p>{venue.description}</p>
                </div>
              )}

              {/* Amenities - Kun vis tilgjengelige tjenester */}
              {venue.meta &&
                Object.values(venue.meta).some((value) => value === true) && (
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

              {/* Hvis ingen tjenester er tilgjengelige */}
              {venue.meta &&
                !Object.values(venue.meta).some((value) => value === true) && (
                  <div className="mb-4">
                    <h5>What this place offers</h5>
                    <p className="text-muted">
                      No additional amenities are available at this property.
                    </p>
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
        <div className={`${Style.calendarSection} col-lg-4 col-md-12`}>
          <div className={`${Style.card} sticky-top`}>
            <div className={`${Style.cardBody}`}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="h4 text-primary">${venue.price}</span>
                <span className="text-muted">per night</span>
              </div>

              {/* Guests selector */}
              <div className="mb-3">
                <label className="form-label small">Number of Guests</label>
                <select
                  className="form-select"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                >
                  {[...Array(venue.maxGuests)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i + 1 === 1 ? "Guest" : "Guests"}
                    </option>
                  ))}
                </select>
              </div>

              {bookingError && (
                <div className="alert alert-danger small mb-3">
                  {bookingError}
                </div>
              )}

              {/* Booking summary */}
              {selectedDates[0] && selectedDates[1] && (
                <div className="bg-light p-3 rounded mb-3">
                  <div className="d-flex justify-content-between small mb-1">
                    <span>Check-in:</span>
                    <span>{selectedDates[0].toLocaleDateString()}</span>
                  </div>
                  <div className="d-flex justify-content-between small mb-1">
                    <span>Check-out:</span>
                    <span>{selectedDates[1].toLocaleDateString()}</span>
                  </div>
                  <div className="d-flex justify-content-between small mb-1">
                    <span>Guests:</span>
                    <span>{guests}</span>
                  </div>
                  <div className="d-flex justify-content-between small mb-1">
                    <span>Nights:</span>
                    <span>
                      {Math.ceil(
                        (selectedDates[1] - selectedDates[0]) /
                          (1000 * 60 * 60 * 24)
                      )}
                    </span>
                  </div>
                  <hr className="my-2" />
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Total:</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </div>
              )}

              {/* Instruksjon for å velge datoer */}
              {(!selectedDates[0] || !selectedDates[1]) && (
                <div className="alert alert-info small mb-3">
                  <i className="fas fa-info-circle me-2"></i>
                  Please select dates on the calendar to the left to see booking
                  details.
                </div>
              )}

              {/* Booking button */}
              <button
                className={`btn w-100 mb-3 ${
                  selectedDates[0] && selectedDates[1]
                    ? "btn-danger"
                    : "btn-outline-secondary"
                }`}
                disabled={!selectedDates[0] || !selectedDates[1] || isBooking}
                onClick={handleDirectBooking}
              >
                {isBooking
                  ? "Booking..."
                  : selectedDates[0] && selectedDates[1]
                  ? `Book Now - $${calculateTotal()}`
                  : "Select Dates First"}
              </button>

              <p className="text-muted text-center small mb-0">
                You will be redirected to confirmation page
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleResult;
