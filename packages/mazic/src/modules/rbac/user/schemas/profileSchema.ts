import { z } from 'zod'

const detailSection = {
  id: z.string().optional(),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().optional(),
  avatar: z
    .union([z.string(), z.instanceof(File)])
    .optional()
    .nullable(),
  bio: z.string().optional(),
}

const dashboardSettingsSection = {
  column_number: z.number().optional(),
  items: z.array(z.string()).optional(),
}

export const detailFields = Object.keys(detailSection)
export const dashboardSettingsFields = Object.keys(dashboardSettingsSection)

export const profileSchema = z.object({
  ...detailSection,
  ...dashboardSettingsSection,
})

export type TProfileCreate = z.infer<typeof profileSchema>
export type TProfile = TProfileCreate & {
  id: string
}
