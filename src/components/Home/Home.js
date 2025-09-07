import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { venuesAPI } from "../Api/Api";
import SearchForm from "../Search/SearchForm";
import SearchResults from "../Search/SearchResults";
import { filterVenues } from "../Search/filterVenues";
import Styles from "./home.module.css";
import fakeAd from "../../img/index-ad-page.jpg";

const FEATURED_VENUE_IDS = [
  "732ec3c2-330b-4a01-8bdd-1ffcad704974",
  "561e92d1-48d1-4a43-a674-0f93b5e21bd1",
  "189e6c43-0885-4b45-83dd-5ae4521915f2",
];

function Home() {
  const [allVenues, setAllVenues] = useState([]);
  const [featuredVenues, setFeaturedVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await venuesAPI.getAll();
        console.log("API Response:", response);
        const venuesData = response.data || [];
        setAllVenues(venuesData);

        const featured = venuesData.filter((venue) =>
          FEATURED_VENUE_IDS.includes(venue.id)
        );
        setFeaturedVenues(featured);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching venues:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenues();
  }, []);

  const handleSearch = (criteria) => {
    setSearchCriteria(criteria);
    setHasSearched(true);

    const filtered = filterVenues(allVenues, criteria);

    console.log("Search criteria:", criteria);
    console.log("Filtered venues:", filtered);
  };

  const filteredVenues = allVenues.filter((venue) => {
    if (!searchCriteria || !searchCriteria.location) return false;
    const city = venue.location?.city?.toLowerCase() || "";
    const country = venue.location?.country?.toLowerCase() || "";
    const search = searchCriteria.location.toLowerCase();
    return city.includes(search) || country.includes(search);
  });

  return (
    <div className={`container-fluid ${Styles.home}`}>
      <div className={`main-heading ${Styles.mainHeading}`}>
        <h1 className={Styles.title}>Your next getaway starts here</h1>
      </div>

      <SearchForm onSearch={handleSearch} />

      {hasSearched && (
        <SearchResults
          venues={filteredVenues}
          isLoading={false}
          error={error}
          hasSearched={hasSearched}
          searchCriteria={searchCriteria}
        />
      )}

      <div className={Styles.featuredSection}>
        <h2 className={Styles.featuredTitle}>Trending Destinations</h2>
        {isLoading ? (
          <div className={Styles.loading}>Loading featured venues...</div>
        ) : (
          <div className={Styles.featuredGrid}>
            {featuredVenues.map((venue) => (
              <div key={venue.id} className={Styles.featuredCard}>
                {venue.media && venue.media.length > 0 && (
                  <img
                    src={venue.media[0].url}
                    alt={venue.name}
                    className={Styles.venueImage}
                  />
                )}

                <div className={Styles.cardContent}>
                  <h3 className={Styles.venueName}>{venue.name}</h3>

                  {venue.location && (
                    <p className={Styles.venueLocation}>
                      📍 {venue.location.city}, {venue.location.country}
                    </p>
                  )}

                  <p className={Styles.venuePrice}>
                    From: ${venue.price}/night
                  </p>

                  <div className={Styles.cardActions}>
                    <Link
                      to={`/venue/${venue.id}`}
                      className={Styles.viewButton}
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/booking/${venue.id}`}
                      className={Styles.bookButton}
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className={Styles.fakeAdvertisement}>
          <img src={fakeAd} alt="Advertisement" className={Styles.adImage} />
          <div className={Styles.adText}>Your Escape Starts Here </div>
          <button className={Styles.adButton}>Book Now</button>
        </div>
      </div>

      <div
        id="carouselExampleInterval"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-item active" data-bs-interval="10000">
            <div className={Styles.carouselTextSlide}>
              <div>🌟🌟🌟🌟🌟</div>
              <p>
                Very user-friendly site. Found exactly what I needed in minutes.
                The booking confirmation came right away. Great job, Holidaze!
              </p>
              <p>– Lina M., Stockholm, Sweden</p>
            </div>
          </div>
          <div className="carousel-item" data-bs-interval="2000">
            <div className={Styles.carouselTextSlide}>
              <div>🌟🌟🌟🌟🌟</div>
              <p>
                Holidaze made planning our vacation so simple! The site is
                clean, fast, and easy to navigate. We'll definitely book through
                here again!
              </p>
              <p>— Michael T., UK</p>
            </div>
          </div>
          <div className="carousel-item">
            <div className={Styles.carouselTextSlide}>
              <div>🌟🌟🌟🌟🌟</div>
              <p>
                I've used Holidaze for three trips now and it never disappoints.
                The interface is clean and booking is super easy. Highly
                recommend!
              </p>
              <p>– Sara J., Copenhagen, Denmark</p>
            </div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleInterval"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleInterval"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}

export default Home;
