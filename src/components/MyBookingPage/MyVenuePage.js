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
        `https://v2.api.noroff.dev/holidaze/profiles/${userName}/venues`,
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

      console.log("=== Avatar Update Debug ===");
      console.log("User:", userName);
      console.log("Avatar URL:", newAvatar);
      console.log("Token exists:", !!token);
      console.log("Token:", token?.substring(0, 20) + "...");

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

      console.log("Response status:", response.status);

      const responseText = await response.text();
      console.log("Raw response:", responseText);

      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          errorData = { message: responseText };
        }
        console.error("API Error:", errorData);
        throw new Error(
          errorData.errors?.[0]?.message ||
            errorData.message ||
            `HTTP error! status: ${response.status}`
        );
      }

      const updatedUser = JSON.parse(responseText);
      console.log("Updated user data:", updatedUser);

      
      setUser(updatedUser.data);
      localStorage.setItem("user", JSON.stringify(updatedUser.data));
      setNewAvatar("");

      
      window.dispatchEvent(new Event("storage"));

      alert("Avatar updated successfully!");
    } catch (error) {
      console.error("=== Avatar Update Error ===");
      console.error("Error details:", error);
      console.error("Error message:", error.message);
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
        {/* Header */}

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

        {/* Add New Venue (kun for venue managers) */}
        {user.venueManager && (
          <div className="row mb-5 justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="card bg-transparent border-0">
                <div className="card-header bg-transparent border-0">
                  <h5 className={`${Styles.venueHeader} mb-0`}>
                    Create a New Venue
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
                        console.log("Venue create response:", data);
                        if (!res.ok) {
                          throw new Error(
                            data.errors?.[0]?.message || data.message
                          );
                        }
                        setVenueSuccess(
                          editingVenue ? "Venue updated!" : "Venue created!"
                        );
                        fetchMyVenues(); 
                        setVenueName("");
                        setVenueDesc("");
                        setVenueImg("");
                        setVenuePrice("");
                        setVenueGuests("");
                        setVenueAddress("");
                        setVenueCity("");
                        setVenueCountry("");
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
                    <button
                      type="submit"
                      className={`${Styles.uploadButton} btn`}
                      disabled={venueLoading}
                    >
                      {venueLoading ? "Creating..." : "Upload"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

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
                        <div key={venue.id} className="col-md-6 mb-3">
                          <div className="card h-100">
                            <div className="row g-0 align-items-center">
                              <div className="col-md-5">
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
                                    minHeight: "150px",
                                    height: "350px",
                                  }}
                                />
                              </div>
                              <div className="col-md-7">
                                <div className="card-body">
                                  <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="card-title mb-0">
                                      {venue.name}
                                    </h6>
                                    <span
                                      className="text-muted"
                                      style={{ fontSize: "0.95rem" }}
                                    >
                                      {venue.location?.city},{" "}
                                      {venue.location?.country}
                                    </span>
                                  </div>
                                  <p className="card-text">
                                    {venue.description}
                                  </p>
                                  <p className="card-text mb-1">
                                    <strong>Price:</strong> {venue.price} NOK
                                  </p>
                                  <p className="card-text mb-1">
                                    <strong>Max Guests:</strong>{" "}
                                    {venue.maxGuests}
                                  </p>

                                  <div className="d-flex gap-2 mt-3">
                                    <button
                                      className="btn btn-danger btn-sm"
                                      onClick={() =>
                                        handleDeleteVenue(venue.id)
                                      }
                                    >
                                      Delete
                                    </button>
                                    <button
                                      className="btn btn-secondary btn-sm"
                                      onClick={() => handleEditVenue(venue)}
                                    >
                                      Edit
                                    </button>
                                  </div>
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
