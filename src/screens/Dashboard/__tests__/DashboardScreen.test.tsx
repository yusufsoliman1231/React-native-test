import React from "react";
import { render } from "@testing-library/react-native";
import { DashboardScreen } from "../DashboardScreen";
import { Provider } from "react-redux";
import { createTestStore } from "../../../store/testStore";

const mockReg = {
  id: "reg1",
  userId: "user1",
  eventId: "1",
  registeredAt: "2025-10-01T00:00:00Z",
  event: {
    id: "1",
    name: "Event 1",
    title: "Event 1 Title",
    date: "2025-11-15",
    time: "09:00 AM",
    location: "Location 1",
    description: "Description 1",
    speakers: ["Speaker 1"],
    price: 0,
    image: "https://example.com/image1.jpg",
    capacity: 100,
    availableSpots: 10,
    createdAt: "2025-10-01T00:00:00Z",
  },
};

jest.mock("../../../services/api", () => ({
  useGetRegisteredEventsQuery: () => ({
    data: [mockReg],
    isLoading: false,
    refetch: jest.fn(),
  }),
}));

jest.mock("../../../contexts", () => ({
  useAuth: () => ({
    user: { id: "user1", name: "Test User" },
    logout: jest.fn(),
  }),
}));

describe("DashboardScreen", () => {
  it("renders registered events and user name", () => {
    const store = createTestStore();
    const { getByText } = render(
      <Provider store={store}>
        <DashboardScreen navigation={{ navigate: jest.fn() }} />
      </Provider>
    );
    expect(getByText("Welcome back,")).toBeTruthy();
    expect(getByText("Test User")).toBeTruthy();
    expect(getByText("Event 1")).toBeTruthy();
    // Location is rendered with an icon, match by substring
    expect(getByText(/Location 1/)).toBeTruthy();
  });
});
