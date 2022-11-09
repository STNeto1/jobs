import { z } from 'zod'

export const singleJob = z.object({
  id: z.string().cuid()
})

export const upsertJob = z.object({
  id: z.string().cuid().optional(),
  title: z.string(),
  location: z.string(),
  salary: z.number(),
  remote: z.preprocess((val) => parseInt(val as string), z.number()),
  description: z.string(),
  requirements: z.string()
})
