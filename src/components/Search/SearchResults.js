import React from 'react';
import Styles from './SearchResults.module.css';

function SearchResults({ 
    venues, 
    isLoading, 
    error, 
    hasSearched, 
    searchCriteria, 
    onShowFeatured 
}) {
    if (isLoading) {
        return <div className={Styles.loading}>Loading venues...</div>;
    }

    if (error) {
        return <div className={Styles.error}>Error: {error}</div>;
    }

    if (!venues || venues.length === 0) {
        if (hasSearched && searchCriteria?.location) {
            return (
                <div className={Styles.noResults}>
                    <p>No venues found for "{searchCriteria.location}". Try a different search.</p>
                </div>
            );
        }
        return null;
    }

    return (
        <div className={Styles.venuesSection}>
            {/* Reset button */}
            {hasSearched && onShowFeatured && (
                <div className={Styles.resetSearch}>
                    <button 
                        onClick={onShowFeatured}
                        className={Styles.resetButton}
                    >
                        Show Featured Venues
                    </button>
                </div>
            )}

            <div className={Styles.venuesContainer}>
                <h2 className={Styles.venuesTitle}>
                    {hasSearched && searchCriteria?.location 
                        ? `Search Results for "${searchCriteria.location}"` 
                        : 'Featured Venues'
                    } 
                    ({venues.length} found)
                </h2>
                
                <div className={Styles.venuesGrid}>
                    {venues.map((venue) => (
                        <div key={venue.id} className={Styles.venueCard}>
                            <h3 className={Styles.venueName}>{venue.name}</h3>
                            <p className={Styles.venueDescription}>{venue.description}</p>
                            <p className={Styles.venuePrice}>Price: ${venue.price}</p>
                            <p className={Styles.venueGuests}>Max guests: {venue.maxGuests}</p>
                            {venue.location && (
                                <p className={Styles.venueLocation}>
                                    📍 {venue.location.city}, {venue.location.country}
                                </p>
                            )}
                            {venue.media && venue.media.length > 0 && (
                                <img 
                                    src={venue.media[0].url} 
                                    alt={venue.name}
                                    className={Styles.venueImage}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SearchResults;