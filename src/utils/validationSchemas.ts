import * as yup from "yup";

/**
 * Login validation schema
 */
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

/**
 * Sign up validation schema
 */
export const signUpSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .required("Name is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must not exceed 100 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

/**
 * Event registration validation schema
 */
export const eventRegistrationSchema = yup.object().shape({
  userId: yup.string().required("User ID is required"),
  eventId: yup.string().required("Event ID is required"),
});

/**
 * Event creation/update validation schema
 */
export const eventSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, "Event name must be at least 3 characters")
    .max(100, "Event name must not exceed 100 characters")
    .required("Event name is required"),
  title: yup
    .string()
    .min(3, "Event title must be at least 3 characters")
    .max(100, "Event title must not exceed 100 characters")
    .required("Event title is required"),
  date: yup
    .string()
    .required("Event date is required")
    .test("is-future-date", "Event date must be in the future", (value) => {
      if (!value) return false;
      return new Date(value).getTime() > Date.now();
    }),
  time: yup.string().required("Event time is required"),
  location: yup
    .string()
    .min(3, "Location must be at least 3 characters")
    .max(200, "Location must not exceed 200 characters")
    .required("Location is required"),
  description: yup
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must not exceed 1000 characters")
    .required("Description is required"),
  speakers: yup
    .array()
    .of(yup.string())
    .min(0, "Please add at least one speaker")
    .default([]),
  price: yup
    .number()
    .min(0, "Price cannot be negative")
    .required("Price is required"),
  image: yup
    .string()
    .url("Please enter a valid image URL")
    .required("Image URL is required"),
  capacity: yup
    .number()
    .integer("Capacity must be a whole number")
    .min(1, "Capacity must be at least 1")
    .required("Capacity is required"),
  availableSpots: yup
    .number()
    .integer("Available spots must be a whole number")
    .min(0, "Available spots cannot be negative")
    .test(
      "max-capacity",
      "Available spots cannot exceed capacity",
      function (value) {
        const { capacity } = this.parent;
        return value ? value <= capacity : true;
      }
    )
    .required("Available spots is required"),
});

/**
 * Search filter validation schema
 */
export const searchFilterSchema = yup.object().shape({
  searchQuery: yup.string().max(100, "Search query is too long"),
  sortBy: yup
    .string()
    .oneOf(["date", "name", "price", "lastUpdated"], "Invalid sort option"),
  sortDirection: yup.string().oneOf(["asc", "desc"], "Invalid sort direction"),
});

// Type exports for TypeScript
export type LoginFormData = yup.InferType<typeof loginSchema>;
export type SignUpFormData = yup.InferType<typeof signUpSchema>;
export type EventRegistrationFormData = yup.InferType<
  typeof eventRegistrationSchema
>;
export type EventFormData = yup.InferType<typeof eventSchema>;
export type SearchFilterFormData = yup.InferType<typeof searchFilterSchema>;
