import { router } from '../trpc'
import { authRouter } from './auth'
import { companyRouter } from './company'
import { skillRouter } from './skill'
import { technologyRouter } from './technology'

export const appRouter = router({
  auth: authRouter,
  technology: technologyRouter,
  company: companyRouter,
  skill: skillRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
