import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { singleJob, upsertJob } from '../inputs/job'
import { paginationInput } from '../inputs/pagination'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const jobRouter = router({
  listCompanyJobs: protectedProcedure
    .input(paginationInput)
    .query(async ({ ctx, input }) => {
      const company = await ctx.prisma.company.findFirst({
        where: {
          userId: ctx.session.user.id
        }
      })

      if (!company) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You must have a company to create a job'
        })
      }

      const count = await ctx.prisma.job.count({
        where: {
          companyId: company.id
        }
      })

      const data = await ctx.prisma.job.findMany({
        where: {
          companyId: company.id
        },
        include: {
          technologies: true
        },
        skip: (input.page - 1) * input.limit,
        take: input.limit
      })

      return {
        count,
        data,
        pages: Math.ceil(count / input.limit)
      }
    }),
  upsertJob: protectedProcedure
    .input(upsertJob)
    .mutation(async ({ ctx, input }) => {
      const company = await ctx.prisma.company.findFirst({
        where: {
          userId: ctx.session.user.id
        }
      })

      if (!company) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You must have a company to create a job'
        })
      }

      if (input.id) {
        const job = await ctx.prisma.job.findFirst({
          where: {
            id: input.id,
            companyId: company.id
          }
        })

        if (!job) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You do not have permission to edit this job'
          })
        }
      }

      const technologies = await ctx.prisma.technology.findMany({
        where: {
          id: {
            in: input.technologies
          }
        }
      })
      if (technologies.length !== input.technologies.length) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'One or more technologies are invalid'
        })
      }

      if (input.id) {
        await ctx.prisma.job.update({
          where: {
            id: input.id
          },
          data: {
            title: input.title,
            location: input.location,
            salary: input.salary,
            description: input.description,
            requirements: input.requirements,
            remote: Boolean(input.remote),
            companyId: company.id,
            level: input.level,
            technologies: {
              connect: technologies.map((technology) => ({
                id: technology.id
              }))
            }
          }
        })
        return
      }

      await ctx.prisma.job.create({
        data: {
          title: input.title,
          location: input.location,
          salary: input.salary,
          description: input.description,
          requirements: input.requirements,
          remote: Boolean(input.remote),
          companyId: company.id,
          level: input.level,
          technologies: {
            connect: technologies.map((technology) => ({
              id: technology.id
            }))
          }
        }
      })
    }),
  deleteJob: protectedProcedure
    .input(singleJob)
    .mutation(async ({ ctx, input }) => {
      const company = await ctx.prisma.company.findFirst({
        where: {
          userId: ctx.session.user.id
        }
      })

      if (!company) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You must have a company to create a job'
        })
      }

      const job = await ctx.prisma.job.findFirst({
        where: {
          id: input.id,
          companyId: company.id
        }
      })

      if (!job) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You do not have permission to delete this job'
        })
      }

      await ctx.prisma.job.delete({
        where: {
          id: input.id
        }
      })
    }),
  latestJobs: publicProcedure
    .input(z.object({ limit: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.job.findMany({
        include: {
          company: {
            select: {
              name: true,
              size: true
            }
          }
        },
        take: input.limit || 3,
        orderBy: {
          createdAt: 'desc'
        }
      })
    })
})
