import React from "react";
import { Link } from "react-router-dom";
import Styles from "./SearchResults.module.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const SearchResults = ({
  venues = [],
  isLoading = false,
  error = null,
  hasSearched = false,
  searchCriteria = {},
  onShowFeatured,
}) => {
  if (isLoading) {
    return (
      <div className={Styles.loadingContainer}>
        <div className={Styles.spinner}></div>
        <p>Searching venues...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={Styles.errorContainer}>
        <div className={Styles.error}>
          <h3>Something went wrong</h3>
          <p>Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className={Styles.retryButton}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (
    hasSearched &&
    (!searchCriteria?.location || searchCriteria.location.trim() === "")
  ) {
    return (
      <div className={Styles.noResultsContainer}>
        <div className={Styles.noResults}>
          <h3>Please enter a search</h3>
          <p>Enter a location to search for venues.</p>
          {onShowFeatured && (
            <button onClick={onShowFeatured} className={Styles.resetButton}>
              Show All Featured Venues
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!venues || venues.length === 0) {
    if (hasSearched && searchCriteria?.location) {
      return (
        <div className={Styles.noResultsContainer}>
          <div className={Styles.noResults}>
            <h3>No venues found</h3>
            <p>
              No venues found for "{searchCriteria.location}". Try a different
              search.
            </p>
            {onShowFeatured && (
              <button onClick={onShowFeatured} className={Styles.resetButton}>
                Show All Featured Venues
              </button>
            )}
          </div>
        </div>
      );
    }
    return null;
  }

  if (
    hasSearched &&
    (!searchCriteria?.location || searchCriteria.location.trim() === "")
  ) {
    return null;
  }

  return (
    <div className={Styles.searchResults}>
      <div className={Styles.resultsHeader}>
        <h2 className={Styles.resultsTitle}>
          {hasSearched && searchCriteria?.location
            ? `Search Results for "${searchCriteria.location}"`
            : "Featured Venues"}
          <span className={Styles.resultsCount}>({venues.length} found)</span>
        </h2>

        {hasSearched && onShowFeatured && (
          <button onClick={onShowFeatured} className={Styles.resetButton}>
            Show Featured Venues
          </button>
        )}
      </div>

      {/* Venues grid */}
      <div className={Styles.venuesGrid}>
        {venues.map((venue) => (
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

              {/* Description */}
              {venue.description && (
                <p className={Styles.venueDescription}>
                  {venue.description.length > 100
                    ? `${venue.description.substring(0, 100)}...`
                    : venue.description}
                </p>
              )}

              <div className={Styles.venueDetails}>
                <div className={Styles.priceAndAmenities}>
                  <p className={Styles.venuePrice}>
                    from ${venue.price}{" "}
                    <span className={Styles.perNight}>per night</span>
                  </p>

                  {/* Amenities */}
                  {venue.meta && (
                    <div className={Styles.amenities}>
                      {venue.meta.wifi && (
                        <span className={Styles.amenity} title="WiFi">
                          <i className="fas fa-wifi"></i>
                        </span>
                      )}
                      {venue.meta.parking && (
                        <span className={Styles.amenity} title="Parking">
                          <i className="fas fa-car"></i>
                        </span>
                      )}
                      {venue.meta.pets && (
                        <span className={Styles.amenity} title="Pet Friendly">
                          <i className="fas fa-paw"></i>
                        </span>
                      )}
                      {venue.meta.breakfast && (
                        <span className={Styles.amenity} title="Breakfast">
                          <i className="fas fa-coffee"></i>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Max guests */}
                <p className={Styles.venueGuests}>
                  <i className="fas fa-users"></i> Max {venue.maxGuests} guests
                </p>

                {/* Rating */}
                {venue.rating && venue.rating > 0 && (
                  <div className={Styles.rating}>
                    <div className={Styles.stars}>
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fas fa-star ${
                            i < Math.floor(venue.rating)
                              ? Styles.filled
                              : Styles.empty
                          }`}
                        ></i>
                      ))}
                    </div>
                    <span className={Styles.ratingNumber}>
                      ({venue.rating})
                    </span>
                  </div>
                )}
              </div>

              {/* Action buttons*/}
              <div className={Styles.venueActions}>
                <Link to={`/venue/${venue.id}`} className={Styles.viewButton}>
                  View Details
                </Link>
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
};

export default SearchResults;
