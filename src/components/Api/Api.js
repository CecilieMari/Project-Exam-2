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
};

// Venues API
export const venuesAPI = {
  getAll: () => apiCall('/holidaze/venues'),
  getById: (id) => apiCall(`/holidaze/venues/${id}`),
  search: (query) => apiCall(`/holidaze/venues/search?q=${query}`),
};  