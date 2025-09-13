import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { venuesAPI } from "../Api/Api";
import Styles from "./AllVenue.module.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function AllVenue() {
  const [topVenues, setTopVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopVenues = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await venuesAPI.getAll();
        console.log("AllVenue API Response:", response);

        const allVenues = response.data || response || [];
        console.log("All venues count:", allVenues.length);

        const sortedVenues = allVenues
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 20);

        console.log("Top 20 venues:", sortedVenues);
        setTopVenues(sortedVenues);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching top venues:", err);

        const mockTopVenues = [
          {
            id: "mock-1",
            name: "Luxury Hotel Rome",
            description: "5-star luxury hotel in the heart of Rome",
            location: { city: "Rome", country: "Italy" },
            price: 350,
            rating: 4.8,
            maxGuests: 4,
            media: [
              {
                url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400",
                alt: "Luxury Hotel",
              },
            ],
            meta: { wifi: true, parking: true, breakfast: true, pets: false },
          },
          {
            id: "mock-2",
            name: "Cozy London Apartment",
            description: "Modern apartment in central London",
            location: { city: "London", country: "United Kingdom" },
            price: 180,
            rating: 4.5,
            maxGuests: 2,
            media: [
              {
                url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
                alt: "London Apartment",
              },
            ],
            meta: { wifi: true, parking: false, breakfast: false, pets: true },
          },
          {
            id: "mock-3",
            name: "Mountain Cabin Norway",
            description: "Beautiful cabin with mountain views",
            location: { city: "Bergen", country: "Norway" },
            price: 220,
            rating: 4.7,
            maxGuests: 6,
            media: [
              {
                url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
                alt: "Mountain Cabin",
              },
            ],
            meta: { wifi: false, parking: true, breakfast: false, pets: true },
          },
        ];
        console.log("Using fallback mock data");
        setTopVenues(mockTopVenues);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopVenues();
  }, []);

  if (isLoading) {
    return (
      <div className={Styles.loadingContainer}>
        <div className={Styles.spinner}></div>
        <p>Loading top venues...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={Styles.errorContainer}>
        <h2>Error Loading Venues</h2>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className={Styles.retryButton}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={Styles.allVenueContainer}>
      <div className={Styles.venuesGrid}>
        {topVenues.map((venue, index) => (
          <div key={venue.id} className={Styles.venueCard}>
            {/* Venue image */}
            <div className={Styles.imageContainer}>
              {venue.media && venue.media.length > 0 ? (
                <img
                  src={venue.media[0].url}
                  alt={venue.media[0].alt || venue.name}
                  className={Styles.venueImage}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x250?text=No+Image";
                  }}
                />
              ) : (
                <div className={Styles.noImage}>
                  <span>No Image Available</span>
                </div>
              )}
            </div>

            {/* Venue content */}
            <div className={Styles.venueContent}>
              <h3 className={Styles.venueName}>{venue.name}</h3>

              {/* Location */}
              {venue.location && (
                <p className={Styles.venueLocation}>
                  <i className="fas fa-map-marker-alt"></i>{" "}
                  {[venue.location.city, venue.location.country]
                    .filter(Boolean)
                    .join(", ") || "Location not specified"}
                </p>
              )}

              <div className={Styles.venueDetails}>
                <div className={Styles.priceAndAmenities}>
                  <p className={Styles.venuePrice}>from ${venue.price}</p>

                  {venue.meta && (
                    <div className={Styles.amenities}>
                      {venue.meta.wifi && (
                        <span className={Styles.amenity}>
                          <i className="fas fa-wifi"></i>
                        </span>
                      )}
                      {venue.meta.parking && (
                        <span className={Styles.amenity}>
                          <i className="fas fa-car"></i>
                        </span>
                      )}
                      {venue.meta.pets && (
                        <span className={Styles.amenity}>
                          <i className="fas fa-paw"></i>
                        </span>
                      )}
                      {venue.meta.breakfast && (
                        <span className={Styles.amenity}>
                          <i className="fas fa-coffee"></i>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className={Styles.venueActions}>
                <Link to={`/venue/${venue.id}`} className={Styles.bookButton}>
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllVenue;
