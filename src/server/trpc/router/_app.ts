import { router } from '../trpc'
import { authRouter } from './auth'
import { companyRouter } from './company'
import { jobRouter } from './job'
import { skillRouter } from './skill'
import { technologyRouter } from './technology'

export const appRouter = router({
  auth: authRouter,
  technology: technologyRouter,
  company: companyRouter,
  skill: skillRouter,
  job: jobRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
