/**
 * Mock API Implementation
 *
 * Simulates REST API endpoints with realistic delays and responses.
 * All operations work with in-memory mock data.
 */

import {
  mockEvents,
  mockRegistrations,
  findUserByEmail,
  findUserById,
  findEventById,
  addUser,
  addRegistration,
  findRegistrationsByUserId,
  findRegistrationByUserAndEvent,
  generateUserId,
  generateRegistrationId,
} from "./mockData";
import {
  Event,
  Registration,
  AuthResponse,
  LoginCredentials,
  SignUpData,
} from "../types/index";

// Simulate network delay
const delay = (ms: number = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock Login API
 * Authenticates user and returns user data with token
 */
export const mockLogin = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  await delay(1000); // Simulate network delay

  const { email, password } = credentials;

  // Find user by email
  const user = findUserByEmail(email);

  if (!user) {
    throw {
      message: "User not found. Please check your email or sign up.",
      status: 404,
    };
  }

  // Check password
  if (user.password !== password) {
    throw {
      message: "Invalid password. Please try again.",
      status: 401,
    };
  }

  // Generate mock JWT token
  const token = `mock_token_${user.id}_${Date.now()}`;

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
};

/**
 * Mock Sign Up API
 * Creates new user account
 */
export const mockSignUp = async (data: SignUpData): Promise<AuthResponse> => {
  await delay(1200); // Simulate network delay

  const { email, password, name } = data;

  // Check if user already exists
  const existingUser = findUserByEmail(email);
  if (existingUser) {
    throw {
      message: "Email already registered. Please login instead.",
      status: 409,
    };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw {
      message: "Invalid email format.",
      status: 400,
    };
  }

  // Validate password length
  if (password.length < 6) {
    throw {
      message: "Password must be at least 6 characters long.",
      status: 400,
    };
  }

  // Create new user
  const newUser = {
    id: generateUserId(),
    email,
    password,
    name,
    createdAt: new Date().toISOString(),
  };

  addUser(newUser);

  // Generate mock JWT token
  const token = `mock_token_${newUser.id}_${Date.now()}`;

  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;

  return {
    user: userWithoutPassword,
    token,
  };
};

/**
 * Mock Get All Events API
 * Returns list of all available events
 */
export const mockGetEvents = async (): Promise<Event[]> => {
  await delay(600); // Simulate network delay

  // Return copy of events to prevent direct mutation
  return JSON.parse(JSON.stringify(mockEvents));
};

/**
 * Mock Get Event By ID API
 * Returns specific event details
 */
export const mockGetEventById = async (eventId: string): Promise<Event> => {
  await delay(500); // Simulate network delay

  const event = findEventById(eventId);

  if (!event) {
    throw {
      message: "Event not found.",
      status: 404,
    };
  }

  // Return copy to prevent direct mutation
  return JSON.parse(JSON.stringify(event));
};

/**
 * Mock Register For Event API
 * Registers user for an event
 */
export const mockRegisterForEvent = async (
  userId: string,
  eventId: string
): Promise<Registration> => {
  await delay(900); // Simulate network delay

  // Verify user exists
  const user = findUserById(userId);
  if (!user) {
    throw {
      message: "User not found.",
      status: 404,
    };
  }

  // Verify event exists
  const event = findEventById(eventId);
  if (!event) {
    throw {
      message: "Event not found.",
      status: 404,
    };
  }

  // Check if already registered
  const existingRegistration = findRegistrationByUserAndEvent(userId, eventId);
  if (existingRegistration) {
    throw {
      message: "You are already registered for this event.",
      status: 409,
    };
  }

  // Check if event has available spots
  if (event.availableSpots <= 0) {
    throw {
      message: "Sorry, this event is fully booked.",
      status: 400,
    };
  }

  // Create new registration
  const newRegistration: Registration = {
    id: generateRegistrationId(),
    userId,
    eventId,
    registeredAt: new Date().toISOString(),
  };

  addRegistration(newRegistration);

  // Update event available spots
  event.availableSpots -= 1;

  return newRegistration;
};

/**
 * Mock Get User Registrations API
 * Returns all events registered by the user
 */
export const mockGetUserRegistrations = async (
  userId: string
): Promise<Event[]> => {
  await delay(700); // Simulate network delay

  // Get all registrations for user
  const userRegistrations = findRegistrationsByUserId(userId);

  // Get event details for each registration
  const registeredEvents = userRegistrations
    .map((reg) => findEventById(reg.eventId))
    .filter((event): event is Event => event !== undefined);

  // Return copy to prevent direct mutation
  return JSON.parse(JSON.stringify(registeredEvents));
};

/**
 * Mock Get Registered Events API (with registration details)
 * Returns events with registration metadata
 */
export const mockGetRegisteredEvents = async (
  userId: string
): Promise<Registration[]> => {
  await delay(700); // Simulate network delay

  // Get all registrations for user
  const userRegistrations = findRegistrationsByUserId(userId);

  // Attach event details to each registration
  const registrationsWithEvents = userRegistrations.map((reg) => {
    const event = findEventById(reg.eventId);
    return {
      ...reg,
      event: event ? JSON.parse(JSON.stringify(event)) : undefined,
    };
  });

  return registrationsWithEvents;
};

/**
 * Mock Cancel Registration API
 * Cancels user's event registration
 */
export const mockCancelRegistration = async (
  userId: string,
  eventId: string
): Promise<{ message: string }> => {
  await delay(800); // Simulate network delay

  // Find the registration
  const registrationIndex = mockRegistrations.findIndex(
    (reg) => reg.userId === userId && reg.eventId === eventId
  );

  if (registrationIndex === -1) {
    throw {
      message: "Registration not found.",
      status: 404,
    };
  }

  // Remove registration
  mockRegistrations.splice(registrationIndex, 1);

  // Update event available spots
  const event = findEventById(eventId);
  if (event) {
    event.availableSpots += 1;
  }

  return {
    message: "Registration cancelled successfully.",
  };
};

// Export all mock API functions
export const mockAPI = {
  login: mockLogin,
  signUp: mockSignUp,
  getEvents: mockGetEvents,
  getEventById: mockGetEventById,
  registerForEvent: mockRegisterForEvent,
  getUserRegistrations: mockGetUserRegistrations,
  getRegisteredEvents: mockGetRegisteredEvents,
  cancelRegistration: mockCancelRegistration,
};

export default mockAPI;
