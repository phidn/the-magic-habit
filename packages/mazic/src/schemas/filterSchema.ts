import { z } from 'zod'

import { CONFIG } from '@mazic/config/config'

export const commonFilterSchema = {
  page: z.coerce.number().default(CONFIG.pagination.page),
  pageSize: z.coerce.number().default(CONFIG.pagination.pageSize),
  sort: z.string().optional(),
  search: z.string().optional(),
  is_active: z.string().optional(),
}
