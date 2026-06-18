import { z } from 'zod';
import { VALIDATION } from '@/config/constants';

// Base field validations
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(VALIDATION.PASSWORD_MIN, `Password must be at least ${VALIDATION.PASSWORD_MIN} characters`)
  .max(VALIDATION.PASSWORD_MAX, `Password must not exceed ${VALIDATION.PASSWORD_MAX} characters`)
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character');

export const nameSchema = z
  .string()
  .min(VALIDATION.NAME_MIN, `Name must be at least ${VALIDATION.NAME_MIN} characters`)
  .max(VALIDATION.NAME_MAX, `Name must not exceed ${VALIDATION.NAME_MAX} characters`)
  .trim();

export const addressSchema = z
  .string()
  .max(VALIDATION.ADDRESS_MAX, `Address must not exceed ${VALIDATION.ADDRESS_MAX} characters`)
  .optional()
  .or(z.literal(''));

// Auth schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  address: addressSchema,
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// User schemas
export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  address: addressSchema,
  role: z.enum(['admin', 'user', 'store_owner']),
});

export const updateUserSchema = createUserSchema.partial().omit({ password: true });

// Store schemas
export const createStoreSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  owner_id: z.union([z.number(), z.string()]).optional().transform((val) => {
    if (val === '' || val === undefined || val === null) return undefined;
    return typeof val === 'string' ? Number(val) : val;
  }),
});

export const updateStoreSchema = createStoreSchema.partial();

// Rating schemas
export const createRatingSchema = z.object({
  store_id: z.number().min(1, 'Store is required'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must not exceed 5'),
});

export const updateRatingSchema = z.object({
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must not exceed 5'),
});

// Search and filter schemas
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

export const sortSchema = z.object({
  sortBy: z.string().default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const userFiltersSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  role: z.enum(['admin', 'user', 'store_owner']).optional(),
});

export const storeFiltersSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  search: z.string().optional(),
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type CreateStoreFormData = z.infer<typeof createStoreSchema>;
export type UpdateStoreFormData = z.infer<typeof updateStoreSchema>;
export type CreateRatingFormData = z.infer<typeof createRatingSchema>;
export type UpdateRatingFormData = z.infer<typeof updateRatingSchema>;
export type UserFilters = z.infer<typeof userFiltersSchema>;
export type StoreFilters = z.infer<typeof storeFiltersSchema>;

// Form validation helper
export function getFormErrors<T extends Record<string, any>>(
  error: z.ZodError<T>
): Record<keyof T, string> {
  const errors: Record<string, string> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    if (!errors[path]) {
      errors[path] = err.message;
    }
  });
  
  return errors as Record<keyof T, string>;
}

// Validation middleware for API responses
export function validateApiResponse<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('API response validation failed:', error.errors);
      throw new Error('Invalid API response format');
    }
    throw error;
  }
}