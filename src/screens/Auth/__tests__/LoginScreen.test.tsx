import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { LoginScreen } from "../LoginScreen";
import { Provider } from "react-redux";
import { createTestStore } from "../../../store/testStore";

jest.mock("../../../services/api", () => ({
  useLoginMutation: () => [jest.fn(), { isLoading: false }],
}));

jest.mock("../../../contexts", () => ({
  useAuth: () => ({ login: jest.fn(), isAuthenticated: false }),
}));

describe("LoginScreen", () => {
  it("renders login form", () => {
    const store = createTestStore();
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <LoginScreen navigation={{ navigate: jest.fn() }} />
      </Provider>
    );
    // MyTextInput uses placeholder="Enter your email" / "Enter your password"
    expect(getByPlaceholderText("Enter your email")).toBeTruthy();
    expect(getByPlaceholderText("Enter your password")).toBeTruthy();
    // Button text is "Sign In"
    expect(getByText("Sign In")).toBeTruthy();
  });

  it("shows error on empty submit", async () => {
    const store = createTestStore();
    const { getByText } = render(
      <Provider store={store}>
        <LoginScreen navigation={{ navigate: jest.fn() }} />
      </Provider>
    );
    fireEvent.press(getByText("Sign In"));
    await waitFor(() => {
      expect(getByText(/required/i)).toBeTruthy();
    });
  });
});
