const BASE_URL = 'https://v2.api.noroff.dev/holidaze';

// Basic API
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Venues API
export const venuesAPI = {
  getAll: () => apiCall('/venues'),
  getById: (id) => apiCall(`/venues/${id}`),
  search: (query) => apiCall(`/venues/search?q=${query}`),
};

// Bookings API
export const bookingsAPI = {
  getAll: () => apiCall('/bookings'),
  create: (bookingData) => apiCall('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  }),
};

// Profiles API
export const profilesAPI = {
  getProfile: (name) => apiCall(`/profiles/${name}`),
  updateProfile: (name, profileData) => apiCall(`/profiles/${name}`, {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),
};