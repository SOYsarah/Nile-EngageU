import { z } from "zod"

// User profile schema
export const userProfileSchema = z.object({
  email: z.string().email("Invalid email address"),
  display_name: z.string().min(2, "Name must be at least 2 characters").nullable().optional(),
  department: z.string().nullable().optional(),
  student_id: z.string().nullable().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").nullable().optional(),
  role: z.enum(["user", "admin"]).default("user"),
  created_at: z.any().optional(),
  updated_at: z.any().optional(),
})

// Event schema
export const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  long_description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(1, "Location is required"),
  category: z.string().min(1, "Category is required"),
  organizer: z.string().min(1, "Organizer is required"),
  max_attendees: z.number().int().positive().nullable().optional(),
  image_url: z.string().url("Invalid image URL").nullable().optional(),
  created_by: z.string().min(1, "Creator ID is required"),
  created_at: z.any().optional(),
  updated_at: z.any().optional(),
})

// Event registration schema
export const eventRegistrationSchema = z.object({
  event_id: z.string().min(1, "Event ID is required"),
  user_id: z.string().min(1, "User ID is required"),
  status: z.enum(["registered", "cancelled", "waitlisted"]),
  attended: z.boolean().default(false),
  event_creator: z.string().optional(),
  created_at: z.any().optional(),
  updated_at: z.any().optional(),
})

// Club schema
export const clubSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  image_url: z.string().url("Invalid image URL").nullable().optional(),
  created_by: z.string().min(1, "Creator ID is required"),
  created_at: z.any().optional(),
  updated_at: z.any().optional(),
})

// Certificate request schema
export const certificateRequestSchema = z.object({
  user_id: z.string().min(1, "User ID is required"),
  type: z.string().min(1, "Certificate type is required"),
  details: z.string().optional(),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
  admin_message: z.string().nullable().optional(),
  created_at: z.any().optional(),
  updated_at: z.any().optional(),
})

// Validate data against schema
export function validateData<T>(
  schema: z.ZodType<T>,
  data: any,
): {
  isValid: boolean
  data?: T
  errors?: z.ZodError
} {
  try {
    const validatedData = schema.parse(data)
    return { isValid: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, errors: error }
    }
    throw error
  }
}

