import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { EventCard } from "../EventCard";

const mockEvent = {
  id: "1",
  name: "Test Event",
  title: "Test Event Title",
  date: "2025-11-15",
  time: "09:00 AM",
  location: "Test Location",
  description: "Test Description",
  speakers: ["Speaker 1", "Speaker 2"],
  price: 100,
  image: "https://example.com/image.jpg",
  capacity: 100,
  availableSpots: 50,
  createdAt: "2025-10-01T00:00:00Z",
};

describe("EventCard", () => {
  it("renders fullcard variant correctly", () => {
    const { getByText, queryByText } = render(
      <EventCard event={mockEvent} variant="fullcard" onPress={jest.fn()} />
    );
    expect(getByText("Test Event")).toBeTruthy();
    expect(getByText(/Test Location/)).toBeTruthy();
    expect(queryByText("Free")).toBeNull();
    expect(getByText("$100")).toBeTruthy();
    expect(getByText(/50 spots left/)).toBeTruthy();
  });

  it("renders horizontalcard variant correctly", () => {
    const { getByText } = render(
      <EventCard
        event={mockEvent}
        variant="horizontalcard"
        onPress={jest.fn()}
      />
    );
    expect(getByText("Test Event")).toBeTruthy();
    expect(getByText(/Test Location/)).toBeTruthy();
    expect(getByText(/09:00 AM/)).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <EventCard event={mockEvent} variant="fullcard" onPress={onPress} />
    );
    fireEvent.press(getByText("Test Event"));
    expect(onPress).toHaveBeenCalled();
  });
});
