import { z } from 'zod'

export const deleteSkillInput = z.object({
  skill: z.string().cuid()
})

export const upsertSkillInput = z.object({
  skill: z.string().cuid(),
  years: z.number().int()
})
