import { JobLevel } from '@prisma/client'
import { z } from 'zod'

export const singleJob = z.object({
  id: z.string().cuid()
})

export const upsertJob = z.object({
  id: z.string().cuid().optional(),
  title: z.string().min(5),
  location: z.string().min(5),
  salary: z.number(),
  remote: z.preprocess((val) => parseInt(val as string), z.number()),
  description: z.string(),
  requirements: z.string(),
  level: z.nativeEnum(JobLevel),
  technologies: z.array(z.string().cuid()).min(1)
})
