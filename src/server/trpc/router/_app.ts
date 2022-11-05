import { router } from '../trpc'
import { authRouter } from './auth'
import { technologyRouter } from './technology'

export const appRouter = router({
  auth: authRouter,
  technology: technologyRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
