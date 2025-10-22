// This file runs before modules are loaded in tests.
// Provide lightweight mocks for native modules and the RTK Query api object
// so imports like `store` that read `api.reducerPath` won't fail.

// Mock react-native-keyboard-controller native binding
jest.mock("react-native-keyboard-controller", () => ({
  KeyboardAwareScrollView: ({ children }) => children,
}));

// Mock RTK Query api used by the app store
jest.mock("../services/api", () => {
  const reducer = (state = {}) => state;
  const middleware = () => (next) => (action) => next(action);

  return {
    api: {
      reducerPath: "api",
      reducer,
      middleware,
    },
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
    __esModule: true,
  };
});
