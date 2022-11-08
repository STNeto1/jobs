import { CompanySize } from '@prisma/client'
import { z } from 'zod'

export const singleCompany = z.object({
  id: z.string().cuid()
})

export const upsertCompany = z.object({
  name: z.string(),
  size: z.nativeEnum(CompanySize),
  location: z.string()
})
