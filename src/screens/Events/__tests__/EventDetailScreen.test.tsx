import React from "react";
import { render } from "@testing-library/react-native";
import { EventDetailScreen } from "../EventDetailScreen";
import { Provider } from "react-redux";
import { createTestStore } from "../../../store/testStore";

const mockEvent = {
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
};

const mockRegisteredEvents: any[] = []; // no registrations so Register button shows

jest.mock("../../../services/api", () => ({
  useGetEventByIdQuery: () => ({
    data: mockEvent,
    isLoading: false,
    error: null,
  }),
  useGetRegisteredEventsQuery: () => ({ data: mockRegisteredEvents }),
  useRegisterForEventMutation: () => [jest.fn(), { isLoading: false }],
  useCancelRegistrationMutation: () => [jest.fn(), { isLoading: false }],
}));

jest.mock("../../../contexts", () => ({
  useAuth: () => ({
    user: { id: "user1", name: "Test User" },
    isAuthenticated: true,
  }),
}));

describe("EventDetailScreen", () => {
  it("renders event details and registration button", () => {
    const store = createTestStore();
    const { getByText } = render(
      <Provider store={store}>
        <EventDetailScreen
          route={{ params: { eventId: "1" } }}
          navigation={{ goBack: jest.fn() }}
        />
      </Provider>
    );
    expect(getByText("Event 1")).toBeTruthy();
    expect(getByText("Location 1")).toBeTruthy();
    // since mockRegisteredEvents is empty, we expect the Register button
    expect(getByText("Register for Event")).toBeTruthy();
  });
});
