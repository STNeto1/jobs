import { z } from 'zod'

export const paginationInput = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10)
})
