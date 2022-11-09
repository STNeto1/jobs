import { upsertCompany } from '../inputs/company'
import { protectedProcedure, router } from '../trpc'

export const companyRouter = router({
  userCompany: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.company.findUnique({
      where: {
        userId: ctx.session.user.id
      }
    })
  }),
  upsertCompany: protectedProcedure
    .input(upsertCompany)
    .mutation(async ({ ctx, input }) => {
      const { name, size, location, about } = input

      return ctx.prisma.company.upsert({
        where: {
          userId: ctx.session.user.id
        },
        update: {
          name,
          size,
          location,
          about
        },
        create: {
          name,
          size,
          location,
          about,
          user: {
            connect: {
              id: ctx.session.user.id
            }
          }
        }
      })
    })
})
