import { z } from 'zod'

export const criterionSchema = z.object({
  id: z.string().optional(),
  habit_id: z.string().optional(),
  name: z.string().min(1, 'Criterion name is required'),
  goal_number: z.number().min(0, 'Goal must be a positive number').default(10),
})

export type TCriterion = z.infer<typeof criterionSchema>

export const criteriaListSchema = z.array(criterionSchema)
