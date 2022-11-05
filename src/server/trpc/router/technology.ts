import slugify from 'slugify'
import { paginationInput } from '../inputs/pagination'
import { upsertTechnology } from '../inputs/technology'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const technologyRouter = router({
  store: protectedProcedure
    .input(upsertTechnology)
    .mutation(async ({ ctx, input }) => {
      const { title } = input

      const count = await ctx.prisma.technology.count()

      const technology = await ctx.prisma.technology.create({
        data: {
          title,
          slug: slugify([count + 1, title].join(' '), { lower: true })
        }
      })

      return technology
    }),
  getAll: publicProcedure
    .input(paginationInput)
    .query(async ({ ctx, input }) => {
      const count = await ctx.prisma.technology.count()

      const data = await ctx.prisma.technology.findMany({
        skip: (input.page - 1) * input.limit,
        take: input.limit
      })

      return {
        count,
        data,
        pages: Math.ceil(count / input.limit)
      }
    })
})
