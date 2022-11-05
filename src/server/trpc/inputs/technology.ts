import { z } from 'zod'

export const upsertTechnology = z.object({
  id: z.string().optional(),
  title: z.string()
})

export const singleTechnology = z.object({
  id: z.string().cuid()
})
