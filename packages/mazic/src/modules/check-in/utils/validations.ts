import { z } from 'zod'

export const checkInSchema = z
  .object({
    id: z.string().optional(),
    habit_id: z.string().min(1, 'Habit is required'),
    date: z.date({
      message: 'Date is required',
    }),
    value: z.number().optional().nullable(),
    is_done: z.boolean().default(false).optional(),
    journal: z.string().optional().default(''),
  })
  .superRefine((data, ctx) => {
    if (typeof data.is_done !== 'boolean' && !data.value) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Value must be greater than or equal to 0',
        path: ['value'],
      })
    }
  })

export type THabitCheckIn = z.infer<typeof checkInSchema>
