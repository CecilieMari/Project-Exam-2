import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Styles from "./MyBookingPage.module.css";

const MyBookingPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newAvatar, setNewAvatar] = useState("");
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const [showAvatarForm, setShowAvatarForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUserData();
    fetchUserBookings();
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load user data");
    }
  };

  const fetchUserBookings = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const userName = JSON.parse(localStorage.getItem("user")).name;
      const response = await fetch(
        `https://v2.api.noroff.dev/holidaze/profiles/${userName}/bookings?_venue=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": "bffb1d1f-dc02-40ef-80e1-4446b9acc60a",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("User bookings from API:", data.data);
        setBookings(data.data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
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
      setShowAvatarForm(false);

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

  const getCurrentBookings = () => {
    const today = new Date();
    return bookings.filter((booking) => new Date(booking.dateTo) >= today);
  };

  const getPastBookings = () => {
    const today = new Date();
    return bookings.filter((booking) => new Date(booking.dateTo) < today);
  };

  if (loading) {
    return (
      <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
        <div className="alert alert-danger">User data not found</div>
      </div>
    );
  }

  return (
    <div className={`${Styles.dashboard} container-fluid py-4`}>
      <div className="container">
        {/* User Profile Section*/}
        <div className="row mb-5">
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

        {error && (
          <div className="row mb-3">
            <div className="col-12">
              <div className="alert alert-danger">{error}</div>
            </div>
          </div>
        )}

        <div className="row mb-5">
          <div className="col-12">
            <div className="card bg-transparent border-0">
              <div className="card-header bg-transparent border-0">
                <h5 className={`${Styles.venueHeader} mb-0`}>
                  Current & Upcoming Bookings
                </h5>
              </div>
              <div className="card-body">
                {getCurrentBookings().length === 0 ? (
                  <p className="text-muted text-center py-4">
                    You have no current or upcoming bookings.
                  </p>
                ) : (
                  <div className="row">
                    {getCurrentBookings().map((booking) => (
                      <div key={booking.id} className="col-md-6 mb-3">
                        <div className="card h-100">
                          <div className="row g-0 align-items-center">
                            <div className="col-md-5">
                              <img
                                src={
                                  booking.venue?.media?.[0]?.url ||
                                  "https://via.placeholder.com/300x200"
                                }
                                className="img-fluid rounded-start"
                                alt={
                                  booking.venue?.media?.[0]?.alt ||
                                  booking.venue?.name
                                }
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
                                    {booking.venue?.name || "Venue Name"}
                                  </h6>
                                  <span className="badge bg-success">
                                    Active
                                  </span>
                                </div>
                                <p className="card-text mb-1">
                                  <strong>Check-in:</strong>{" "}
                                  {new Date(
                                    booking.dateFrom
                                  ).toLocaleDateString()}
                                </p>
                                <p className="card-text mb-1">
                                  <strong>Check-out:</strong>{" "}
                                  {new Date(
                                    booking.dateTo
                                  ).toLocaleDateString()}
                                </p>
                                <p className="card-text mb-1">
                                  <strong>Guests:</strong> {booking.guests}
                                </p>
                                <p className="card-text mb-1">
                                  <strong>Location:</strong>{" "}
                                  {booking.venue?.location?.city},{" "}
                                  {booking.venue?.location?.country}
                                </p>
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

        <div className="row mb-5">
          <div className="col-12">
            <div className="card bg-transparent border-0">
              <div className="card-header bg-transparent border-0">
                <h5 className={`${Styles.venueHeader} mb-0`}>Past Bookings</h5>
              </div>
              <div className="card-body">
                {getPastBookings().length === 0 ? (
                  <p className="text-muted text-center py-4">
                    You have no past bookings.
                  </p>
                ) : (
                  <div className="row">
                    {getPastBookings().map((booking) => (
                      <div key={booking.id} className="col-md-6 mb-3">
                        <div className="card h-100">
                          <div className="row g-0 align-items-center">
                            <div className="col-md-5">
                              <img
                                src={
                                  booking.venue?.media?.[0]?.url ||
                                  "https://via.placeholder.com/300x200"
                                }
                                className="img-fluid rounded-start"
                                alt={
                                  booking.venue?.media?.[0]?.alt ||
                                  booking.venue?.name
                                }
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
                                    {booking.venue?.name || "Venue Name"}
                                  </h6>
                                  <span className="badge bg-secondary">
                                    Completed
                                  </span>
                                </div>
                                <p className="card-text mb-1">
                                  <strong>Check-in:</strong>{" "}
                                  {new Date(
                                    booking.dateFrom
                                  ).toLocaleDateString()}
                                </p>
                                <p className="card-text mb-1">
                                  <strong>Check-out:</strong>{" "}
                                  {new Date(
                                    booking.dateTo
                                  ).toLocaleDateString()}
                                </p>
                                <p className="card-text mb-1">
                                  <strong>Guests:</strong> {booking.guests}
                                </p>
                                <p className="card-text mb-1">
                                  <strong>Location:</strong>{" "}
                                  {booking.venue?.location?.city},{" "}
                                  {booking.venue?.location?.country}
                                </p>
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
      </div>
    </div>
  );
};

export default MyBookingPage;
