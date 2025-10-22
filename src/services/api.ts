import { createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type {
  AuthResponse,
  LoginCredentials,
  SignUpData,
  Event,
  Registration,
} from "../types/index";
import { mockAPI } from "./mockAPI";

const mockBaseQuery =
  (): BaseQueryFn<
    {
      endpoint: string;
      args?: any;
    },
    unknown,
    unknown
  > =>
  async ({ endpoint, args }) => {
    try {
      let result;

      // Route to appropriate mock API function
      switch (endpoint) {
        case "login":
          result = await mockAPI.login(args);
          break;
        case "signUp":
          result = await mockAPI.signUp(args);
          break;
        case "getEvents":
          result = await mockAPI.getEvents();
          break;
        case "getEventById":
          result = await mockAPI.getEventById(args);
          break;
        case "registerForEvent":
          result = await mockAPI.registerForEvent(args.userId, args.eventId);
          break;
        case "getUserRegistrations":
          result = await mockAPI.getUserRegistrations(args);
          break;
        case "getRegisteredEvents":
          result = await mockAPI.getRegisteredEvents(args);
          break;
        case "cancelRegistration":
          result = await mockAPI.cancelRegistration(args.userId, args.eventId);
          break;
        default:
          throw new Error(`Unknown endpoint: ${endpoint}`);
      }

      return { data: result };
    } catch (error: any) {
      return {
        error: {
          status: error.status || 500,
          data: error.message || "An error occurred",
        },
      };
    }
  };

const baseQuery = mockBaseQuery();

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["User", "Events", "Registrations"],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        endpoint: "login",
        args: credentials,
      }),
      invalidatesTags: ["User"],
    }),

    signUp: builder.mutation<AuthResponse, SignUpData>({
      query: (userData) => ({
        endpoint: "signUp",
        args: userData,
      }),
      invalidatesTags: ["User"],
    }),

    // Event Endpoints
    getEvents: builder.query<Event[], void>({
      query: () => ({
        endpoint: "getEvents",
      }),
      providesTags: ["Events"],
    }),

    getEventById: builder.query<Event, string>({
      query: (id) => ({
        endpoint: "getEventById",
        args: id,
      }),
      providesTags: (result, error, id) => [{ type: "Events", id }],
    }),

    // Registration Endpoints
    registerForEvent: builder.mutation<
      Registration,
      { userId: string; eventId: string }
    >({
      query: ({ userId, eventId }) => ({
        endpoint: "registerForEvent",
        args: { userId, eventId },
      }),
      invalidatesTags: ["Registrations", "Events"],
    }),

    getUserRegistrations: builder.query<Registration[], string>({
      query: (userId) => ({
        endpoint: "getUserRegistrations",
        args: userId,
      }),
      providesTags: ["Registrations"],
    }),

    // Get events with registration details
    // Get events user has registered for (with event details)
    getRegisteredEvents: builder.query<Registration[], string>({
      query: (userId) => ({
        endpoint: "getRegisteredEvents",
        args: userId,
      }),
      providesTags: ["Registrations", "Events"],
    }),

    // Cancel registration
    cancelRegistration: builder.mutation<
      { message: string },
      { userId: string; eventId: string }
    >({
      query: ({ userId, eventId }) => ({
        endpoint: "cancelRegistration",
        args: { userId, eventId },
      }),
      invalidatesTags: ["Registrations", "Events"],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignUpMutation,
  useGetEventsQuery,
  useGetEventByIdQuery,
  useRegisterForEventMutation,
  useGetUserRegistrationsQuery,
  useGetRegisteredEventsQuery,
  useCancelRegistrationMutation,
} = api;
