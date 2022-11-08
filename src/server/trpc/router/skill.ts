import { deleteSkillInput, upsertSkillInput } from '../inputs/skill'
import { protectedProcedure, router } from '../trpc'

export const skillRouter = router({
  userSkills: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.userSkill.findMany({
      where: {
        userId: ctx.session.user.id
      },
      include: {
        skill: true
      }
    })
  }),
  upsertUserSkill: protectedProcedure
    .input(upsertSkillInput)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.userSkill.upsert({
        where: {
          userId_skillId: {
            userId: ctx.session.user.id,
            skillId: input.skill
          }
        },
        create: {
          years: input.years,
          skillId: input.skill,
          userId: ctx.session.user.id
        },
        update: {
          years: input.years
        }
      })
    }),
  removeSkill: protectedProcedure
    .input(deleteSkillInput)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.userSkill.delete({
        where: {
          userId_skillId: {
            userId: ctx.session.user.id,
            skillId: input.skill
          }
        }
      })
    })
})
