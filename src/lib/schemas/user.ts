import { z } from 'zod'

export const userSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email('Invalid email format'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  imageUrl: z.union([z.string().url('Invalid URL format'), z.string().length(0)]).optional().nullable(),
  isPublic: z.boolean().optional(),
  publicTestTiles: z.boolean().optional(),
  publicCollections: z.boolean().optional(),
  publicDecorations: z.boolean().optional(),
  publicClayBodies: z.boolean().optional(),
})

export const profileUpdateSchema = z
  .object({
    email: z.string().email(),
    username: z.string().min(3),
    firstName: z.string().optional().nullable(),
    lastName: z.string().optional().nullable(),
    imageUrl: z.string().optional().nullable(),
    isPublic: z.boolean().optional(),
    publicTestTiles: z.boolean().optional(),
    publicCollections: z.boolean().optional(),
    publicDecorations: z.boolean().optional(),
    publicClayBodies: z.boolean().optional(),
    currentPassword: z.string().optional().nullable(),
    newPassword: z.string().optional().nullable()
      .refine((val) => !val || val.length >= 6, {
        message: "Password must be at least 6 characters long"
      }),
    confirmNewPassword: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      // Only validate passwords if any password field has a value
      if (data.currentPassword || data.newPassword || data.confirmNewPassword) {
        return (
          data.currentPassword &&
          data.newPassword &&
          data.confirmNewPassword &&
          data.newPassword === data.confirmNewPassword
        )
      }
      return true
    },
    {
      message: 'New passwords must match and current password is required to change password',
      path: ['confirmNewPassword'],
    }
  )

export type UserFormData = z.infer<typeof userSchema>
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>
