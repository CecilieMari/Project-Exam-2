export function filterVenues(venues, searchCriteria) {
    let filteredVenues = venues;

    // Filtrer basert på lokasjon
    if (searchCriteria.location && searchCriteria.location.trim()) {
        const location = searchCriteria.location.toLowerCase();
        filteredVenues = filteredVenues.filter(venue => 
            venue.name.toLowerCase().includes(location) ||
            venue.description.toLowerCase().includes(location) ||
            (venue.location && venue.location.country && 
             venue.location.country.toLowerCase().includes(location)) ||
            (venue.location && venue.location.city && 
             venue.location.city.toLowerCase().includes(location))
        );
    }

    // Filtrer basert på antall gjester
    if (searchCriteria.travelers) {
        filteredVenues = filteredVenues.filter(venue => 
            venue.maxGuests >= parseInt(searchCriteria.travelers)
        );
    }

    return filteredVenues;
}