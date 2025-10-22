/**
 * Mock API Configuration
 *
 * This uses in-memory mock data - no external API needed!
 * All data is stored locally and simulates real API behavior.
 */

export const API_CONFIG = {
  // Use empty base URL - we're using mock data
  BASE_URL: "",

  // API endpoints (not used with mock, but kept for compatibility)
  ENDPOINTS: {
    LOGIN: "/login",
    SIGNUP: "/users",
    EVENTS: "/events",
    EVENT_BY_ID: (id: string) => `/events/${id}`,
    REGISTRATIONS: "/registrations",
    USER_REGISTRATIONS: (userId: string) => `/registrations?userId=${userId}`,
  },

  // Timeout for API requests (in milliseconds)
  TIMEOUT: 10000,

  // Enable debug logging in development
  DEBUG: __DEV__,

  // Use mock API instead of real endpoints
  USE_MOCK: true,
};
