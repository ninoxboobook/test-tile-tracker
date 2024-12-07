import { z } from 'zod'

export const userSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email('Invalid email format'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  imageUrl: z.union([z.string().url('Invalid URL format'), z.string().length(0)]).optional().nullable(),
})

export const profileUpdateSchema = userSchema
  .extend({
    currentPassword: z.string().optional(),
    newPassword: z.string().min(6, 'Password must be at least 6 characters').optional(),
    confirmNewPassword: z.string().optional(),
  })
  .omit({ id: true })
  .refine((data) => {
    // If newPassword is provided, confirmNewPassword must match
    if (data.newPassword) {
      return data.newPassword === data.confirmNewPassword
    }
    // If newPassword is not provided, confirmNewPassword should also not be provided
    return !data.confirmNewPassword
  }, {
    message: "Passwords don't match",
    path: ['confirmNewPassword']
  })
  .refine((data) => {
    // If newPassword is provided, currentPassword must also be provided
    if (data.newPassword) {
      return !!data.currentPassword
    }
    return true
  }, {
    message: "Current password is required to set a new password",
    path: ['currentPassword']
  })

export type UserFormData = z.infer<typeof userSchema>
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>
