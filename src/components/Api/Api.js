const BASE_URL = 'https://v2.api.noroff.dev';

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
     
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.errors && errorData.errors.length > 0) {
          errorMessage = errorData.errors.map(err => err.message).join(', ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
      
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Auth API
export const authAPI = {
  register: (userData) => apiCall('/auth/register', {  
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  login: (credentials) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  // Legg til denne nye funksjonen
  getProfile: (accessToken) => apiCall('/auth/profile', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  }),
};

// Venues API
export const venuesAPI = {
  getAll: () => apiCall('/holidaze/venues'),
  getById: (id) => apiCall(`/holidaze/venues/${id}`),
  search: (query) => apiCall(`/holidaze/venues/search?q=${query}`),
  // Legg til disse nye funksjonene for venue managers
  create: (venueData, accessToken) => apiCall('/holidaze/venues', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(venueData),
  }),
  update: (id, venueData, accessToken) => apiCall(`/holidaze/venues/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(venueData),
  }),
  delete: (id, accessToken) => apiCall(`/holidaze/venues/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  }),
};

// Bookings API - legg til denne helt nye seksjonen
export const bookingsAPI = {
  getMyBookings: (accessToken) => apiCall('/holidaze/bookings', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  }),
  create: (bookingData, accessToken) => apiCall('/holidaze/bookings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(bookingData),
  }),
  getById: (id, accessToken) => apiCall(`/holidaze/bookings/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  }),
  update: (id, bookingData, accessToken) => apiCall(`/holidaze/bookings/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(bookingData),
  }),
  delete: (id, accessToken) => apiCall(`/holidaze/bookings/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  }),
};

