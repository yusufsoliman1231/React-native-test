/**
 * User interface
 */
export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  createdAt?: string;
}

/**
 * Auth response from API
 */
export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Sign up data
 */
export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

/**
 * Event interface
 */
export interface Event {
  id: string;
  name: string;
  title: string;
  date: string; // ISO date string
  time: string;
  location: string;
  description: string;
  speakers: string[];
  price: number;
  isFree?: boolean; // Computed from price
  image: string;
  capacity: number;
  availableSpots: number;
  registeredCount?: number; // Computed from capacity - availableSpots
  createdAt?: string;
  lastUpdated?: number;
}

/**
 * Registration interface
 */
export interface Registration {
  id: string;
  userId: string;
  eventId: string;
  registeredAt: string;
  event?: Event;
}

/**
 * Event registration data
 */
export interface EventRegistrationData {
  userId: string;
  eventId: string;
}

/**
 * Sort options for event list
 */
export enum SortBy {
  DATE = "date",
  NAME = "name",
  PRICE = "price",
  LAST_UPDATED = "lastUpdated",
}

/**
 * Sort direction
 */
export enum SortDirection {
  ASC = "asc",
  DESC = "desc",
}

/**
 * Search and sort state
 */
export interface FilterState {
  searchQuery: string;
  sortBy: SortBy;
  sortDirection: SortDirection;
}

/**
 * Loading state for async operations
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

/**
 * Snackbar message
 */
export interface SnackbarMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  scope?: "global" | "modal" | "both";
  action?: {
    label: string;
    actionType: "UNDO" | "RETRY" | "DISMISS";
    actionId?: string;
  };
  duration?: number;
}

/**
 * API Error Response
 */
export interface ApiError {
  message: string;
  status?: number;
}

/**
 * Conflict payload for handling sync conflicts
 */
export interface ConflictPayload {
  conflictId: string;
  clientEvent: Event;
  serverEvent: Event;
}

/**
 * Undo action for reverting changes
 */
export interface UndoAction {
  id: string;
  type: "REGISTRATION" | "CANCELLATION" | "EVENT_UPDATE";
  previousValue: any;
  timestamp: number;
}
