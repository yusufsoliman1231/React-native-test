# Event Booking App

A modern React Native mobile application for browsing and registering for events. Built with React Native, Expo, TypeScript, Redux Toolkit, and RTK Query with a complete mock backend.

## Features

### User Authentication

- ✅ Sign Up with email, name, and password validation
- ✅ Login with secure credential validation
- ✅ Persistent authentication using MMKV (high-performance storage)
- ✅ Token-based authentication with auto-logout
- ✅ Protected routes and navigation guards
- ✅ Snackbar notifications for auth feedback

### Event Management

- ✅ Browse all available events with full-width cards
- ✅ **Real-time search** with 300ms debounce for performance
- ✅ **Advanced sorting** (by date, name, price) with direction toggle
- ✅ View detailed event information with images
- ✅ **Register/Cancel registration** for events
- ✅ Real-time available spots tracking
- ✅ Event capacity management
- ✅ **Registration status checking** (prevents duplicate registrations)
- ✅ **Undo registration** from success snackbar
- ✅ Modal presentation for event details

### User Dashboard

- ✅ View all registered events with horizontal cards
- ✅ Pull-to-refresh functionality
- ✅ Quick navigation to event details
- ✅ Empty state with "Browse Events" CTA
- ✅ Logout with confirmation dialog
- ✅ Auto-navigation to auth on logout

### UI/UX Features

- ✅ **Reusable EventCard component** with 2 variants:
  - `fullcard` - Full-width cards for browsing (EventListScreen)
  - `horizontalcard` - Compact horizontal cards (DashboardScreen)
- ✅ **Global Snackbar system** with scoped messages (global/modal/both)
- ✅ **Memoized Redux selectors** for performance optimization
- ✅ Responsive design with custom hooks (spacing, fs, responsive)
- ✅ Loading states with activity indicators
- ✅ Error boundaries and error handling
- ✅ Form validation with error messages
- ✅ Keyboard-aware scrolling
- ✅ Native tab navigation with icons

### Technical Features

- ✅ **Redux Toolkit** for state management
- ✅ **RTK Query** with mock API integration
- ✅ **TypeScript** with strict type safety
- ✅ **Memoized selectors** (createSelector) for performance
- ✅ **Custom hooks** (useDebounce, useColorScheme, useRedux)
- ✅ **MMKV storage** for fast persistent data
- ✅ **Mock API** with realistic delays and error simulation
- ✅ **React Navigation** with nested navigators
- ✅ **Responsive design system** with scaling utilities
- ✅ **Keyboard controller** for better UX
- ✅ **Gesture handler** for smooth interactions

## Tech Stack

- **React Native 0.81** with **Expo 54**
- **TypeScript 5.9** for type safety
- **Redux Toolkit 2.9** & **RTK Query** for state and API management
- **React Navigation 7** (Stack + Bottom Tabs)
- **MMKV 4.0** for high-performance local storage
- **React Hook Form + Yup** for form validation
- **React Native Keyboard Controller** for keyboard handling
- **React Native Gesture Handler** for smooth interactions
- **React Native Reanimated** for animations
- **Mock API** with realistic delays (no external API needed)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

## Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd Booking
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

## Mock API Setup

**Good News!** This project includes a complete **built-in mock API** - no external API setup required!

The mock API (`src/services/mockAPI.ts`) provides:

- ✅ User authentication (signup/login)
- ✅ Event management (CRUD operations)
- ✅ Registration system with capacity management
- ✅ Realistic network delays (500-800ms)
- ✅ In-memory data storage
- ✅ Sample events pre-loaded

### Pre-loaded Sample Events

The app comes with 6 sample events including:

- React Native Conference 2025
- TypeScript Workshop
- Node.js Masterclass
- Design Systems Summit
- Mobile DevOps Workshop
- GraphQL Deep Dive

All events have realistic data with images, speakers, pricing, and capacity management.

## Running the App

### Start the development server

```bash
npm start
```

### Run on iOS

```bash
npm run ios
```

### Run on Android

```bash
npm run android
```

### Run on Web

```bash
npm run web
```

## Testing

Run tests:

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

## Project Structure

```text
src/
├── components/              # Reusable UI components
│   ├── ui/                 # Base UI components
│   │   ├── MyButton.tsx
│   │   ├── MyText.tsx
│   │   ├── MyTextInput.tsx
│   │   └── EmptyFooter.tsx
│   ├── EventCard.tsx       # Reusable event card (fullcard/horizontalcard)
│   ├── Snackbar.tsx        # Global notification system
│   └── Collapsible.tsx
├── config/                 # Configuration files
│   └── api.ts             # API configuration
├── constants/              # App constants
│   ├── Colors.ts
│   └── Responsive.ts      # Responsive design utilities
├── contexts/               # React Context providers
│   └── AuthContext.tsx    # Authentication context
├── hooks/                  # Custom React hooks
│   ├── useDebounce.ts     # Debounce hook (300ms)
│   ├── useRedux.ts        # Typed Redux hooks
│   ├── useThemeColor.ts
│   └── useColorScheme.ts
├── navigation/             # Navigation configuration
│   ├── RootStack.tsx      # Root navigator with auth guards
│   └── LibraryTabs.tsx
├── screens/                # Screen components
│   ├── Auth/
│   │   ├── LoginScreen.tsx
│   │   └── SignUpScreen.tsx
│   ├── Events/
│   │   ├── EventListScreen.tsx    # Browse events with search/sort
│   │   └── EventDetailScreen.tsx  # Event details with register/cancel
│   ├── Dashboard/
│   │   └── DashboardScreen.tsx    # User's registered events
│   └── NotFound.tsx
├── services/               # API services
│   ├── api.ts             # RTK Query API definitions
│   ├── mockAPI.ts         # Mock backend implementation
│   └── sync.ts
├── store/                  # Redux store
│   ├── index.ts           # Store configuration
│   ├── authSlice.ts       # Auth state management
│   ├── booksSlice.ts      # (Legacy - can be removed)
│   ├── eventsSlice.ts     # Events state (search, sort, filter)
│   ├── snackbarSlice.ts   # Snackbar notifications
│   ├── booksSelectors.ts  # Memoized book selectors
│   ├── eventsSelectors.ts # Memoized event selectors
│   └── snackbarSelectors.ts # Memoized snackbar selectors
├── types/                  # TypeScript definitions
│   └── index.ts           # All type definitions
└── App.tsx                # App entry point
```

## Key Files Explained

### Components

- **EventCard.tsx**: Reusable card component with two variants
  - `fullcard`: Full-width cards for event browsing
  - `horizontalcard`: Compact cards for dashboard
- **Snackbar.tsx**: Global notification system with scope support (global/modal/both)

### Screens

- **EventListScreen.tsx**: Main browsing screen with search (debounced 300ms) and sorting
- **EventDetailScreen.tsx**: Modal screen with event details and register/cancel actions
- **DashboardScreen.tsx**: Shows user's registered events with pull-to-refresh

### Services

- **mockAPI.ts**: Complete in-memory mock backend
  - User authentication with email validation
  - Event CRUD operations
  - Registration system with capacity management
  - Realistic network delays

### Store

- **eventsSlice.ts**: Manages events state, search query, and sorting
- **snackbarSlice.ts**: Global notification state with scoped messages
- **authSlice.ts**: Authentication state with MMKV persistence

## API Integration

The app uses **RTK Query** with a custom mock backend. All API endpoints are defined in `src/services/api.ts`:

### Authentication Endpoints

- `POST /signup` - Create new user account
- `POST /login` - Authenticate user (custom validation)

### Event Endpoints

- `GET /events` - Get all events
- `GET /events/:id` - Get event by ID

### Registration Endpoints

- `POST /registrations` - Register for an event
- `GET /registrations?userId=:userId` - Get user's registrations
- `GET /registeredEvents?userId=:userId` - Get registered events with full event data
- `DELETE /registrations` - Cancel registration

## State Management

The app uses **Redux Toolkit** with the following slices:

### authSlice

- Manages authentication state
- Persists token and user data in MMKV
- Auto-logout on token expiration

### eventsSlice

- Manages events list
- Search query (debounced)
- Sort settings (by date/name/price, ASC/DESC)
- Filtered and sorted events via memoized selectors

### snackbarSlice

- Global notification system
- Scoped messages (global/modal/both)
- Action support (e.g., UNDO registration)
- Auto-dismiss with configurable duration

### Memoized Selectors

Performance-optimized selectors using `createSelector`:

- `selectFilteredEvents` - Filters and sorts events
- `selectGlobalMessages` - Filters snackbar messages for global scope
- `selectModalMessages` - Filters snackbar messages for modal scope

## Custom Hooks

### useDebounce

Debounces value changes (used for search with 300ms delay)

```typescript
const debouncedValue = useDebounce(searchQuery, 300);
```

### useRedux

Typed Redux hooks for better TypeScript support

```typescript
const dispatch = useAppDispatch();
const state = useAppSelector(selectState);
```

## Features Deep Dive

### Search & Filter System

- Real-time search across event names and descriptions
- 300ms debounce to prevent excessive Redux updates
- Local state for immediate UI updates
- Memoized filtering for performance

### Registration System

- Check if user is already registered
- Real-time capacity management
- Undo registration from success snackbar
- Auto-update available spots
- Prevent duplicate registrations

### Snackbar Notification System

- Global scope for app-wide notifications
- Modal scope for modal-specific notifications
- Both scope for notifications visible everywhere
- Action support (UNDO, custom actions)
- Auto-dismiss with configurable duration
- Memoized selectors prevent unnecessary re-renders

### Responsive Design

Custom utility functions for cross-device support:

```typescript
spacing(16); // Scales based on screen size
fs(14); // Font size scaling
responsive.radiusMd; // Responsive border radius
```

## Implemented Features & Improvements

✅ **Complete Authentication System**

- Secure signup and login with validation
- MMKV-based persistent storage
- Protected routes with navigation guards
- Auto-logout on token expiration

✅ **Advanced Event Browsing**

- Debounced search (300ms) for optimal performance
- Multi-criteria sorting (date, name, price)
- Ascending/descending sort direction toggle
- Memoized selectors for efficient filtering

✅ **Smart Registration System**

- Duplicate registration prevention
- Real-time capacity management
- Cancel registration with confirmation
- Undo action from snackbar notification
- Registration status tracking

✅ **Reusable Components**

- EventCard with 2 variants (full/horizontal)
- Global Snackbar system with scoped messages
- Responsive design utilities
- Custom typed hooks

✅ **Performance Optimizations**

- Memoized Redux selectors (createSelector)
- Debounced search input
- MMKV for fast storage
- RTK Query caching and invalidation

✅ **Professional UX**

- Pull-to-refresh on lists
- Loading states and error handling
- Empty states with CTAs
- Keyboard-aware scrolling
- Smooth modal transitions
- Confirmation dialogs for destructive actions

## Testing

The project includes Jest and React Native Testing Library setup:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Screenshots

Add screenshots of your app here

## Demo Video

Add link to your screen recording here

## Future Enhancements

- [ ] Real backend API integration
- [ ] Password hashing (bcrypt/argon2)
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Event categories and filtering
- [ ] Image upload for events
- [ ] Pagination for event lists
- [ ] Push notifications for reminders
- [ ] Calendar integration
- [ ] QR code for event check-in
- [ ] Payment integration (Stripe)
- [ ] Social media sharing
- [ ] Event reviews and ratings
- [ ] Dark mode support

## Troubleshooting

### Metro bundler issues

```bash
npm start -- --reset-cache
```

### iOS build issues

```bash
cd ios && pod install && cd ..
npm run ios
```

### Android build issues

```bash
cd android && ./gradlew clean && cd ..
npm run android
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for learning and development.

## Author

**Yusuf Soliman**

---

## Quick Start Guide

1. **Clone and Install**

   ```bash
   git clone <repo-url>
   cd Booking
   npm install
   ```

2. **Start Development Server**

   ```bash
   npm start
   ```

3. **Test Credentials**

   - Sign up with any email/name/password
   - Or use demo: `test@example.com` / `password123`

4. **Explore Features**
   - Browse events with search and sorting
   - Register for events
   - View dashboard with registered events
   - Cancel registrations
   - Test undo functionality

**Built with ❤️ using React Native, TypeScript, and Redux Toolkit**
