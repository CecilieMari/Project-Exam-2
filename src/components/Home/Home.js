import React, { useState, useEffect } from 'react';
import { venuesAPI } from '../Api/Api';
import SearchForm from '../Search/SearchForm';
import SearchResults from '../Search/SearchResults';
import { filterVenues } from '../Search/filterVenues';
import Styles from './home.module.css';
import fakeAd from '../../img/index-ad-page.jpg';


    const FEATURED_VENUE_IDS = ['7d74e8bc-ef55-4d26-803f-753c59e8b710', '561e92d1-48d1-4a43-a674-0f93b5e21bd1', '286904cb-ab00-4252-a770-7a6d9dc82e69'];

function Home() {
    const [venues, setVenues] = useState([]);
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
            const response = await venuesAPI.getAll(); // Riktig metodenavn
            console.log('API Response:', response);
            const venuesData = response.data || [];
            setAllVenues(venuesData);

            const featured = venuesData.filter(venue => 
                FEATURED_VENUE_IDS.includes(venue.id)
            );
            setFeaturedVenues(featured);    
            
        } catch (err) {
            setError(err.message);
            console.error('Error fetching venues:', err);
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
        setVenues(filtered);
        console.log('Search criteria:', criteria);
        console.log('Filtered venues:', filtered);
    };

    return (
        <div className={`container-fluid ${Styles.home}`}>
            <div className={`main-heading ${Styles.mainHeading}`}>
                <h1 className={Styles.title}>Your next getaway starts here</h1>
            </div>

            <SearchForm onSearch={handleSearch} />

            
            {hasSearched && (
                <SearchResults 
                    venues={venues}
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
                                
                                {venue.location && (
                                    <p className={Styles.venueLocation}>
                                        📍 {venue.location.city}, {venue.location.country}
                                    </p>
                                )}
                               
                                <p className={Styles.venuePrice}>From: ${venue.price}</p>
                                
                            </div>
                        ))}
                    </div>
                )}
                <div className={Styles.fakeAdvertisement}>
                    <img 
                        src={fakeAd}
                        alt="Advertisement"
                        className={Styles.adImage}
                    />
                    <div className={Styles.adText}>Your Escape Starts Here </div>
                    <button className={Styles.adButton}>Book Now</button>
                </div>
            </div>
             <div id="carouselExampleInterval" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active" data-bs-interval="10000">
                         <div className={Styles.carouselTextSlide}>
                <div>🌟🌟🌟🌟🌟</div>
                <p>Very user-friendly site. Found exactly what I needed in minutes. 
                    The booking confirmation came right away. Great job, Holidaze!</p>
                    <p>– Lina M., Stockholm, Sweden</p>
            </div>
                    </div>
                    <div className="carousel-item" data-bs-interval="2000">
                        <div className={Styles.carouselTextSlide}>
                <div>🌟🌟🌟🌟🌟</div>
                <p>Holidaze made planning our vacation so simple! The site is clean, fast, 
                    and easy to navigate. We’ll definitely book through here again!</p>
                    <p>— Michael T., UK</p>
                    
            </div>
                    </div>
                    <div className="carousel-item">
                         <div className={Styles.carouselTextSlide}>
                <div>🌟🌟🌟🌟🌟</div>
                <p>I’ve used Holidaze for three trips now and it never disappoints. The interface is clean and booking is 
                    super easy. Highly recommend!</p>
                    <p>– Sara J., Copenhagen, Denmark</p>
            </div>
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    );
}

export default Home;