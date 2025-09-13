import React, { useState } from "react";
import Styles from "./SearchForm.module.css";

function SearchForm({ onSearch }) {
  const [searchLocation, setSearchLocation] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [travelers, setTravelers] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      location: searchLocation,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      travelers: travelers,
    });
  };

  return (
    <form
      className={`d-flex ${Styles.searchForm}`}
      role="search"
      onSubmit={handleSubmit}
    >
      <div className={Styles.searchRow}>
        <input
          className={`form-control me-2 ${Styles.srcHotel}`}
          type="search"
          placeholder="Where (Country, City, or Hotel)"
          aria-label="Search"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
        />
        <input
          className={`form-control me-2 ${Styles.srcHotel}`}
          type="date"
          placeholder="Check in"
          aria-label="Check in"
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
        />
        <input
          className={`form-control me-2 ${Styles.srcHotel}`}
          type="date"
          placeholder="Check out"
          aria-label="Check out"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
        />
        <input
          className={`form-control me-2 ${Styles.srcHotel}`}
          type="number"
          placeholder="Travellers"
          aria-label="Travellers"
          min="1"
          value={travelers}
          onChange={(e) => setTravelers(e.target.value)}
        />
      </div>
      <button
        className={`btn btn-outline-success ${Styles.srcButton}`}
        type="submit"
      >
        Search
      </button>
    </form>
  );
}

export default SearchForm;
