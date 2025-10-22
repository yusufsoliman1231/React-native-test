import "@testing-library/jest-native/extend-expect";

// Mock Expo winter runtime
jest.mock("expo/src/winter/installGlobal", () => ({}));
jest.mock("expo/src/winter/runtime.native", () => ({}));

// Mock Expo modules
jest.mock("expo-font", () => ({
  useFonts: () => [true],
  isLoaded: () => true,
}));

jest.mock("expo-splash-screen", () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

jest.mock("expo-asset", () => ({
  Asset: {
    fromModule: jest.fn(() => ({
      uri: "mocked-asset",
    })),
  },
}));

// Mock react-native-reanimated
jest.mock("react-native-reanimated", () => ({
  default: {
    call: () => {},
  },
  useSharedValue: jest.fn(() => ({ value: 0 })),
  useAnimatedStyle: jest.fn(() => ({})),
  withTiming: jest.fn((value) => value),
  withSpring: jest.fn((value) => value),
}));

// Mock react-native-safe-area-context
jest.mock("react-native-safe-area-context", () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

// Mock react-native-keyboard-controller to prevent native binding errors in tests
jest.mock("react-native-keyboard-controller", () => ({
  KeyboardAwareScrollView: ({ children }: { children: React.ReactNode }) =>
    children,
}));

// Mock Animated.timing/spring to avoid real timers in animations during tests
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const RN = require("react-native");
  if (RN && RN.Animated) {
    RN.Animated.timing = (value: any, config: any) => ({
      start: (cb?: any) => {
        if (typeof cb === "function") cb();
      },
      stop: () => {},
    });
    RN.Animated.spring = RN.Animated.timing;
  }
} catch (e) {
  // ignore in environments where react-native is not the same module
}

// Global test utilities
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};

// Provide a global mock for the RTK Query api used in store/index.ts
// so tests importing the real store won't fail during initialization.
jest.mock("../services/api", () => {
  const reducer = (state = {}) => state;
  const middleware = () => (next: any) => (action: any) => next(action);

  return {
    api: {
      reducerPath: "api",
      reducer,
      middleware,
    },
    // Minimal hook stubs - tests can override with per-test jest.mock if needed
    useGetEventsQuery: jest.fn(() => ({
      data: [],
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    })),
    useGetEventByIdQuery: jest.fn(() => ({
      data: null,
      isLoading: false,
      error: null,
    })),
    useGetRegisteredEventsQuery: jest.fn(() => ({
      data: [],
      isLoading: false,
      refetch: jest.fn(),
    })),
    useRegisterForEventMutation: jest.fn(() => [
      jest.fn(),
      { isLoading: false },
    ]),
    useCancelRegistrationMutation: jest.fn(() => [
      jest.fn(),
      { isLoading: false },
    ]),
    // Expose a no-op middleware to concat on configureStore
    __esModule: true,
  };
});
