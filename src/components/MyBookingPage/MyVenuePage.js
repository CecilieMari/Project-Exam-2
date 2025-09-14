import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Styles from "./MyBookingPage.module.css";

const MyVenuePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [newAvatar, setNewAvatar] = useState("");
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const [venueName, setVenueName] = useState("");
  const [venueDesc, setVenueDesc] = useState("");
  const [venueImg, setVenueImg] = useState("");
  const [venuePrice, setVenuePrice] = useState("");
  const [venueGuests, setVenueGuests] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [venueCity, setVenueCity] = useState("");
  const [venueCountry, setVenueCountry] = useState("");
  const [venueError, setVenueError] = useState("");
  const [venueSuccess, setVenueSuccess] = useState("");
  const [venueLoading, setVenueLoading] = useState(false);
  const [myVenues, setMyVenues] = useState([]);
  const [showAvatarForm, setShowAvatarForm] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [searchLocation] = useState("");

  
  const [venueBookings, setVenueBookings] = useState({});
  const [loadingBookings, setLoadingBookings] = useState({});
  const [showBookings, setShowBookings] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUserData();
    fetchMyVenues();
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchMyVenues = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const userName = JSON.parse(localStorage.getItem("user")).name;
      const response = await fetch(
        `https://v2.api.noroff.dev/holidaze/profiles/${userName}/venues?_bookings=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": "bffb1d1f-dc02-40ef-80e1-4446b9acc60a",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Mine venues fra API:", data.data);
        setMyVenues(data.data);
      }
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
  };

  const fetchVenueBookings = async (venueId) => {
    setLoadingBookings((prev) => ({ ...prev, [venueId]: true }));
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `https://v2.api.noroff.dev/holidaze/venues/${venueId}?_bookings=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": "bffb1d1f-dc02-40ef-80e1-4446b9acc60a",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Venue bookings:", data.data.bookings);
        setVenueBookings((prev) => ({
          ...prev,
          [venueId]: data.data.bookings || [],
        }));
      }
    } catch (error) {
      console.error("Error fetching venue bookings:", error);
      setVenueBookings((prev) => ({
        ...prev,
        [venueId]: [],
      }));
    } finally {
      setLoadingBookings((prev) => ({ ...prev, [venueId]: false }));
    }
  };

  const toggleBookings = async (venueId) => {
    const isCurrentlyShowing = showBookings[venueId];

    setShowBookings((prev) => ({
      ...prev,
      [venueId]: !isCurrentlyShowing,
    }));

    if (!isCurrentlyShowing && !venueBookings[venueId]) {
      await fetchVenueBookings(venueId);
    }
  };

  const updateAvatar = async (e) => {
    e.preventDefault();
    if (!newAvatar) return;

    if (!newAvatar.match(/\.(jpeg|jpg|gif|png)$/i)) {
      alert(
        "Please use a direct link to an image file (must end with .jpg, .png, .gif, etc.)"
      );
      return;
    }

    setIsUpdatingAvatar(true);
    try {
      const token = localStorage.getItem("accessToken");
      const userName = user.name;

      const response = await fetch(
        `https://v2.api.noroff.dev/holidaze/profiles/${userName}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": "bffb1d1f-dc02-40ef-80e1-4446b9acc60a",
          },
          body: JSON.stringify({
            avatar: {
              url: newAvatar,
              alt: `${user.name}'s avatar`,
            },
          }),
        }
      );

      const responseText = await response.text();

      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          errorData = { message: responseText };
        }
        throw new Error(
          errorData.errors?.[0]?.message ||
            errorData.message ||
            `HTTP error! status: ${response.status}`
        );
      }

      const updatedUser = JSON.parse(responseText);
      setUser(updatedUser.data);
      localStorage.setItem("user", JSON.stringify(updatedUser.data));
      setNewAvatar("");

      window.dispatchEvent(new Event("storage"));
      alert("Avatar updated successfully!");
    } catch (error) {
      alert(`Failed to update avatar: ${error.message}`);
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) {
    return (
      <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
        <div className="alert alert-danger">User data not found</div>
      </div>
    );
  }

  const handleDeleteVenue = async (venueId) => {
    if (!window.confirm("Are you sure you want to delete this venue?")) return;
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `https://v2.api.noroff.dev/holidaze/venues/${venueId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": "bffb1d1f-dc02-40ef-80e1-4446b9acc60a",
          },
        }
      );
      if (res.ok) {
        setMyVenues((prev) => prev.filter((v) => v.id !== venueId));
      } else {
        alert("Failed to delete venue.");
      }
    } catch (error) {
      alert("Error deleting venue.");
    }
  };

  const handleEditVenue = (venue) => {
    setEditingVenue(venue);
    setVenueName(venue.name);
    setVenueDesc(venue.description);
    setVenueImg(venue.media?.[0]?.url || "");
    setVenuePrice(venue.price);
    setVenueGuests(venue.maxGuests);
    setVenueAddress(venue.location?.address || "");
    setVenueCity(venue.location?.city || "");
    setVenueCountry(venue.location?.country || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredVenues = myVenues.filter((venue) => {
    const city = venue.location?.city?.toLowerCase() || "";
    const country = venue.location?.country?.toLowerCase() || "";
    return (
      city.includes(searchLocation.toLowerCase()) ||
      country.includes(searchLocation.toLowerCase())
    );
  });

  return (
    <div className={`${Styles.dashboard} container-fluid py-4`}>
      <div className="container">
        {/* User Profile Section */}
        <div className="row mb-5 ">
          <div className="col-12">
            <div className="card h-100 border-0 bg-transparent">
              <div className="card-body bg-transparent">
                <div className="d-flex align-items-center justify-content-center">
                  <img
                    src={user.avatar?.url || "https://via.placeholder.com/150"}
                    alt={user.name}
                    className={`${Styles.avatar} rounded-circle me-3`}
                  />
                  <div>
                    <span className={`${Styles.welcomeText}`}>
                      Welcome, {user?.name}!
                    </span>
                    <p className="text-muted mb-0">{user.email}</p>
                    <div className="d-flex align-items-start gap-2 mt-2">
                      {!showAvatarForm ? (
                        <button
                          className={`${Styles.btn} btn btn-link p-0 mt-3`}
                          style={{ textDecoration: "underline" }}
                          onClick={() => setShowAvatarForm(true)}
                          type="button"
                        >
                          Change avatar
                        </button>
                      ) : (
                        <form onSubmit={updateAvatar} className="mt-4">
                          <div className="mb-3">
                            <label className="form-label">
                              Update Avatar URL:
                            </label>
                            <input
                              type="url"
                              className="form-control"
                              value={newAvatar}
                              onChange={(e) => setNewAvatar(e.target.value)}
                              placeholder="https://example.com/your-image.jpg"
                            />
                            <div className="form-text">
                              <small>
                                <strong>
                                  Must be a direct link to the image (ends with
                                  .jpg, .png, etc.)
                                </strong>
                              </small>
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isUpdatingAvatar || !newAvatar}
                          >
                            {isUpdatingAvatar ? "Updating..." : "Update Avatar"}
                          </button>
                          <button
                            type="button"
                            className="btn btn-link ms-2"
                            onClick={() => setShowAvatarForm(false)}
                          >
                            Cancel
                          </button>
                        </form>
                      )}

                      <button
                        onClick={logout}
                        className={`${Styles.btn} btn btn-link p-0 mt-3`}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add New Venue */}
        {user.venueManager && (
          <div className="row mb-5 justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="card bg-transparent border-0">
                <div className="card-header bg-transparent border-0">
                  <h5 className={`${Styles.venueHeader} mb-0`}>
                    {editingVenue ? "Edit Venue" : "Create a New Venue"}
                  </h5>
                </div>
                <div className="card-body bg-transparent border-0">
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setVenueError("");
                      setVenueSuccess("");
                      setVenueLoading(true);
                      try {
                        const token = localStorage.getItem("accessToken");
                        const method = editingVenue ? "PUT" : "POST";
                        const url = editingVenue
                          ? `https://v2.api.noroff.dev/holidaze/venues/${editingVenue.id}`
                          : "https://v2.api.noroff.dev/holidaze/venues";
                        const res = await fetch(url, {
                          method,
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                            "X-Noroff-API-Key":
                              "bffb1d1f-dc02-40ef-80e1-4446b9acc60a",
                          },
                          body: JSON.stringify({
                            name: venueName,
                            description: venueDesc,
                            media: [{ url: venueImg, alt: venueName }],
                            price: Number(venuePrice),
                            maxGuests: Number(venueGuests),
                            location: {
                              address: venueAddress,
                              city: venueCity,
                              country: venueCountry,
                            },
                          }),
                        });
                        const data = await res.json();
                        if (!res.ok) {
                          throw new Error(
                            data.errors?.[0]?.message || data.message
                          );
                        }
                        setVenueSuccess(
                          editingVenue ? "Venue updated!" : "Venue created!"
                        );
                        fetchMyVenues();
                        // Reset form
                        setVenueName("");
                        setVenueDesc("");
                        setVenueImg("");
                        setVenuePrice("");
                        setVenueGuests("");
                        setVenueAddress("");
                        setVenueCity("");
                        setVenueCountry("");
                        setEditingVenue(null);
                      } catch (err) {
                        setVenueError(err.message);
                      } finally {
                        setVenueLoading(false);
                      }
                    }}
                  >
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Venue Name</label>
                        <input
                          className="form-control"
                          required
                          value={venueName}
                          onChange={(e) => setVenueName(e.target.value)}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">City</label>
                        <input
                          className="form-control"
                          required
                          value={venueCity}
                          onChange={(e) => setVenueCity(e.target.value)}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Country</label>
                        <input
                          className="form-control"
                          required
                          value={venueCountry}
                          onChange={(e) => setVenueCountry(e.target.value)}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          required
                          value={venueDesc}
                          onChange={(e) => setVenueDesc(e.target.value)}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Image URL</label>
                        <input
                          className="form-control"
                          required
                          value={venueImg}
                          onChange={(e) => setVenueImg(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Price per night</label>
                        <input
                          type="number"
                          className="form-control"
                          required
                          value={venuePrice}
                          onChange={(e) => setVenuePrice(e.target.value)}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Max Guests</label>
                        <input
                          type="number"
                          className="form-control"
                          required
                          value={venueGuests}
                          onChange={(e) => setVenueGuests(e.target.value)}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Address</label>
                        <input
                          className="form-control"
                          required
                          value={venueAddress}
                          onChange={(e) => setVenueAddress(e.target.value)}
                        />
                      </div>
                    </div>

                    {venueError && (
                      <div className="alert alert-danger">{venueError}</div>
                    )}
                    {venueSuccess && (
                      <div className="alert alert-success">{venueSuccess}</div>
                    )}
                    <div className="d-flex gap-2">
                      <button
                        type="submit"
                        className={`${Styles.uploadButton} btn`}
                        disabled={venueLoading}
                      >
                        {venueLoading
                          ? editingVenue
                            ? "Updating..."
                            : "Creating..."
                          : editingVenue
                          ? "Update Venue"
                          : "Create Venue"}
                      </button>
                      {editingVenue && (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => {
                            setEditingVenue(null);
                            setVenueName("");
                            setVenueDesc("");
                            setVenueImg("");
                            setVenuePrice("");
                            setVenueGuests("");
                            setVenueAddress("");
                            setVenueCity("");
                            setVenueCountry("");
                          }}
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Venues Section */}
        {user.venueManager && (
          <div className="row mb-5">
            <div className="col-12">
              <div className="card bg-transparent border-0">
                <div className="card-header bg-transparent border-0">
                  <h5 className={`${Styles.venueHeader} mb-0`}>My Venues</h5>
                </div>
                <div className="card-body">
                  {myVenues.length === 0 ? (
                    <p className="text-muted text-center py-4">
                      You have not created any venues yet.
                    </p>
                  ) : (
                    <div className="row">
                      {filteredVenues.map((venue) => (
                        <div key={venue.id} className="col-12 mb-4">
                          <div className="card h-100">
                            <div className="row g-0">
                              <div className="col-md-4">
                                <img
                                  src={
                                    venue.media?.[0]?.url ||
                                    "https://via.placeholder.com/300x200"
                                  }
                                  className="img-fluid rounded-start"
                                  alt={venue.media?.[0]?.alt || venue.name}
                                  style={{
                                    width: "100%",
                                    objectFit: "cover",
                                    height: "250px",
                                  }}
                                />
                              </div>
                              <div className="col-md-8">
                                <div className="card-body">
                                  <div className="d-flex justify-content-between align-items-start mb-2">
                                    <div>
                                      <h5 className="card-title mb-1">
                                        {venue.name}
                                      </h5>
                                      <p className="text-muted mb-1">
                                        <i className="fas fa-map-marker-alt me-1"></i>
                                        {venue.location?.city},{" "}
                                        {venue.location?.country}
                                      </p>
                                    </div>
                                    <div className="text-end">
                                      <span className="fw-bold text-primary">
                                        ${venue.price} NOK/night
                                      </span>
                                      <br />
                                      <small className="text-muted">
                                        Max {venue.maxGuests} guests
                                      </small>
                                    </div>
                                  </div>

                                  <p className="card-text mb-3">
                                    {venue.description}
                                  </p>

                                  <div className="d-flex flex-wrap gap-2 mb-3">
                                    <button
                                      className="btn btn-outline-primary btn-sm"
                                      onClick={() => toggleBookings(venue.id)}
                                    >
                                      <i
                                        className={`fas ${
                                          showBookings[venue.id]
                                            ? "fa-eye-slash"
                                            : "fa-eye"
                                        } me-1`}
                                      ></i>
                                      {showBookings[venue.id]
                                        ? "Hide Bookings"
                                        : "View Bookings"}
                                      {venueBookings[venue.id] && (
                                        <span className="badge bg-primary ms-1">
                                          {venueBookings[venue.id].length}
                                        </span>
                                      )}
                                    </button>
                                    <button
                                      className="btn btn-outline-secondary btn-sm"
                                      onClick={() => handleEditVenue(venue)}
                                    >
                                      <i className="fas fa-edit me-1"></i>Edit
                                    </button>
                                    <button
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={() =>
                                        handleDeleteVenue(venue.id)
                                      }
                                    >
                                      <i className="fas fa-trash me-1"></i>
                                      Delete
                                    </button>
                                  </div>

                                  {/* BOOKINGS SECTION */}
                                  {showBookings[venue.id] && (
                                    <div className="mt-3 border-top pt-3">
                                      <h6 className="fw-bold mb-3">
                                        <i className="fas fa-calendar-check me-2"></i>
                                        Bookings for this venue
                                      </h6>

                                      {loadingBookings[venue.id] ? (
                                        <div className="text-center py-3">
                                          <div className="spinner-border spinner-border-sm me-2">
                                            <span className="visually-hidden">
                                              Loading...
                                            </span>
                                          </div>
                                          Loading bookings...
                                        </div>
                                      ) : venueBookings[venue.id]?.length ===
                                        0 ? (
                                        <div className="alert alert-info">
                                          <i className="fas fa-info-circle me-2"></i>
                                          No bookings for this venue yet.
                                        </div>
                                      ) : (
                                        <div className="row">
                                          {venueBookings[venue.id]?.map(
                                            (booking, index) => (
                                              <div
                                                key={booking.id}
                                                className="col-md-6 mb-3"
                                              >
                                                <div className="card border-start border-primary border-3">
                                                  <div className="card-body p-3">
                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                      <h6 className="card-title mb-1">
                                                        <i className="fas fa-user me-1"></i>
                                                        {booking.customer
                                                          ?.name ||
                                                          "Unknown Guest"}
                                                      </h6>
                                                      <span className="badge bg-success">
                                                        {booking.guests}{" "}
                                                        {booking.guests === 1
                                                          ? "guest"
                                                          : "guests"}
                                                      </span>
                                                    </div>

                                                    <div className="mb-2">
                                                      <small className="text-muted d-block">
                                                        <i className="fas fa-envelope me-1"></i>
                                                        {booking.customer
                                                          ?.email ||
                                                          "No email provided"}
                                                      </small>
                                                    </div>

                                                    <div className="row text-sm">
                                                      <div className="col-6">
                                                        <small className="text-muted d-block">
                                                          Check-in:
                                                        </small>
                                                        <strong>
                                                          {new Date(
                                                            booking.dateFrom
                                                          ).toLocaleDateString()}
                                                        </strong>
                                                      </div>
                                                      <div className="col-6">
                                                        <small className="text-muted d-block">
                                                          Check-out:
                                                        </small>
                                                        <strong>
                                                          {new Date(
                                                            booking.dateTo
                                                          ).toLocaleDateString()}
                                                        </strong>
                                                      </div>
                                                    </div>

                                                    <div className="mt-2 pt-2 border-top">
                                                      <small className="text-muted">
                                                        Booking ID: {booking.id}
                                                      </small>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyVenuePage;
