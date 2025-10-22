import { User, Event, Registration } from "../types/index";

export let mockUsers: (User & { password: string })[] = [
  {
    id: "1",
    email: "demo@example.com",
    password: "password123",
    name: "Demo User",
  },
  {
    id: "2",
    email: "john@example.com",
    password: "john123",
    name: "John Doe",
  },
];

export let mockEvents: Event[] = [
  {
    id: "1",
    name: "Tech Conference",
    title: "Tech Conference 2024",
    description:
      "Join us for the biggest tech conference of the year featuring keynotes from industry leaders, hands-on workshops, and networking opportunities.",
    date: "2024-03-15",
    time: "09:00 AM",
    location: "San Francisco Convention Center",
    price: 299,
    capacity: 500,
    availableSpots: 450,
    image: "https://picsum.photos/400/300?random=1",
    speakers: ["Dr. Sarah Johnson", "Mark Thompson", "Lisa Chen"],
  },
  {
    id: "2",
    name: "Music Festival",
    title: "Music Festival Summer Vibes",
    description:
      "Experience three days of incredible music performances from top artists around the world. Multiple stages, food vendors, and camping available.",
    date: "2024-07-20",
    time: "02:00 PM",
    location: "Golden Gate Park, San Francisco",
    price: 150,
    capacity: 10000,
    availableSpots: 9800,
    image: "https://picsum.photos/400/300?random=2",
    speakers: ["Various Artists"],
  },
  {
    id: "3",
    name: "Startup Pitch Night",
    title: "Startup Pitch Night",
    description:
      "Watch innovative startups pitch their ideas to top investors. Great networking opportunity for entrepreneurs and investors alike.",
    date: "2024-04-10",
    time: "06:00 PM",
    location: "Silicon Valley Innovation Hub",
    price: 50,
    capacity: 200,
    availableSpots: 180,
    image: "https://picsum.photos/400/300?random=3",
    speakers: ["John Davis", "Emily Rodriguez"],
  },
  {
    id: "4",
    name: "Yoga Retreat",
    title: "Yoga & Wellness Retreat",
    description:
      "Rejuvenate your mind and body with daily yoga sessions, meditation workshops, healthy meals, and spa treatments in a peaceful mountain setting.",
    date: "2024-05-05",
    time: "07:00 AM",
    location: "Mountain View Retreat Center",
    price: 450,
    capacity: 50,
    availableSpots: 35,
    image: "https://picsum.photos/400/300?random=4",
    speakers: ["Yoga Master Priya", "Wellness Coach Mike"],
  },
  {
    id: "5",
    name: "Wine Tasting",
    title: "Food & Wine Tasting",
    description:
      "Sample exquisite wines paired with gourmet dishes prepared by celebrity chefs. Learn about wine regions and tasting techniques.",
    date: "2024-06-12",
    time: "05:00 PM",
    location: "Napa Valley Winery",
    price: 125,
    capacity: 100,
    availableSpots: 75,
    image: "https://picsum.photos/400/300?random=5",
    speakers: ["Chef Gordon", "Sommelier Maria"],
  },
  {
    id: "6",
    name: "Marketing Summit",
    title: "Digital Marketing Summit",
    description:
      "Learn the latest digital marketing strategies, SEO techniques, and social media trends from industry experts.",
    date: "2024-04-25",
    time: "09:00 AM",
    location: "Downtown Conference Center",
    price: 199,
    capacity: 300,
    availableSpots: 250,
    image: "https://picsum.photos/400/300?random=6",
    speakers: ["Marketing Pro Alex", "SEO Expert Rachel"],
  },
  {
    id: "7",
    name: "Art Exhibition",
    title: "Art Exhibition Opening",
    description:
      "Exclusive opening night for our contemporary art exhibition featuring works from emerging and established artists.",
    date: "2024-03-28",
    time: "07:00 PM",
    location: "Modern Art Gallery",
    price: 0,
    capacity: 150,
    availableSpots: 120,
    image: "https://picsum.photos/400/300?random=7",
    speakers: ["Curator James", "Artist Showcase"],
  },
  {
    id: "8",
    name: "Charity Marathon",
    title: "Marathon Run for Charity",
    description:
      "Participate in our annual charity marathon. All proceeds go to local children's hospitals. Full and half marathon options available.",
    date: "2024-09-10",
    time: "06:00 AM",
    location: "City Central Park",
    price: 40,
    capacity: 5000,
    availableSpots: 4500,
    image: "https://picsum.photos/400/300?random=8",
    speakers: ["Coach Tony", "Medical Team"],
  },
  {
    id: "9",
    name: "Coding Bootcamp",
    title: "Coding Bootcamp Workshop",
    description:
      "Intensive 2-day workshop covering React Native, TypeScript, and modern mobile app development. Includes hands-on projects and mentorship.",
    date: "2024-05-18",
    time: "09:00 AM",
    location: "Tech Learning Center",
    price: 350,
    capacity: 30,
    availableSpots: 15,
    image: "https://picsum.photos/400/300?random=9",
    speakers: ["Developer Pro Sam", "Tech Lead Jessica"],
  },
  {
    id: "10",
    name: "Jazz Night",
    title: "Jazz Night Live",
    description:
      "An intimate evening of smooth jazz performances by acclaimed musicians. Enjoy craft cocktails and light bites.",
    date: "2024-04-05",
    time: "08:00 PM",
    location: "The Blue Note Jazz Club",
    price: 45,
    capacity: 80,
    availableSpots: 60,
    image: "https://picsum.photos/400/300?random=10",
    speakers: ["Jazz Band Quartet"],
  },
];

export let mockRegistrations: Registration[] = [
  {
    id: "1",
    userId: "1",
    eventId: "1",
    registeredAt: "2024-02-01T10:00:00Z",
  },
  {
    id: "2",
    userId: "1",
    eventId: "3",
    registeredAt: "2024-02-10T14:30:00Z",
  },
];

export const addUser = (user: User & { password: string }) => {
  mockUsers.push(user);
  return user;
};

export const findUserByEmail = (email: string) => {
  return mockUsers.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
};

export const findUserById = (id: string) => {
  return mockUsers.find((user) => user.id === id);
};

export const addRegistration = (registration: Registration) => {
  mockRegistrations.push(registration);
  return registration;
};

export const findRegistrationsByUserId = (userId: string) => {
  return mockRegistrations.filter((reg) => reg.userId === userId);
};

export const findRegistrationByUserAndEvent = (
  userId: string,
  eventId: string
) => {
  return mockRegistrations.find(
    (reg) => reg.userId === userId && reg.eventId === eventId
  );
};

export const findEventById = (id: string) => {
  return mockEvents.find((event) => event.id === id);
};

export const getAllEvents = () => {
  return mockEvents;
};

let userIdCounter = mockUsers.length + 1;
let registrationIdCounter = mockRegistrations.length + 1;

export const generateUserId = () => String(userIdCounter++);
export const generateRegistrationId = () => String(registrationIdCounter++);
