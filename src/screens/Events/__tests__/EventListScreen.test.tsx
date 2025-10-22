import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { EventListScreen } from "../EventListScreen";
import { Provider } from "react-redux";
import { createTestStore } from "../../../store/testStore";

const mockEvents = [
  {
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
  {
    id: "2",
    name: "Event 2",
    title: "Event 2 Title",
    date: "2025-12-01",
    time: "10:00 AM",
    location: "Location 2",
    description: "Description 2",
    speakers: ["Speaker 2"],
    price: 50,
    image: "https://example.com/image2.jpg",
    capacity: 50,
    availableSpots: 0,
    createdAt: "2025-10-02T00:00:00Z",
  },
];

jest.mock("../../../services/api", () => ({
  useGetEventsQuery: () => ({
    data: mockEvents,
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  }),
}));

// Mock debounce hook to return the value immediately in tests to avoid timers
jest.mock("../../../hooks/useDebounce", () => ({
  useDebounce: (value: any) => value,
}));

describe("EventListScreen", () => {
  it("renders event list and search bar", () => {
    const store = createTestStore();
    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <EventListScreen navigation={{ navigate: jest.fn() }} />
      </Provider>
    );
    expect(getByText("Event 1")).toBeTruthy();
    expect(getByText("Event 2")).toBeTruthy();
    expect(getByPlaceholderText("Search events...")).toBeTruthy();
  });

  it("filters events by search", async () => {
    const store = createTestStore();
    const { getByPlaceholderText, queryByText } = render(
      <Provider store={store}>
        <EventListScreen navigation={{ navigate: jest.fn() }} />
      </Provider>
    );
    const searchInput = getByPlaceholderText("Search events...");
    fireEvent.changeText(searchInput, "Event 2");
    // wait for debounce (300ms) and Redux update
    await waitFor(
      () => {
        expect(queryByText("Event 1")).toBeNull();
        expect(queryByText("Event 2")).toBeTruthy();
      },
      { timeout: 1000 }
    );
  });
});
