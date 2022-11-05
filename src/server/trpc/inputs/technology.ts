import { z } from 'zod'

export const upsertTechnology = z.object({
  id: z.string().optional(),
  title: z.string()
})
