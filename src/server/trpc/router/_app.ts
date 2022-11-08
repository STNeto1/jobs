import { router } from '../trpc'
import { authRouter } from './auth'
import { companyRouter } from './company'
import { technologyRouter } from './technology'

export const appRouter = router({
  auth: authRouter,
  technology: technologyRouter,
  company: companyRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
