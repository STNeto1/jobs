import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Select,
  Skeleton,
  Text
} from '@chakra-ui/react'
import type { GetServerSidePropsContext, NextPage } from 'next'
import { unstable_getServerSession } from 'next-auth'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import DashboardTemplate from '../../templates/DashboardTemplate'
import { trpc } from '../../utils/trpc'
import { authOptions } from '../api/auth/[...nextauth]'

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  )

  if (!session) {
    return {
      redirect: {
        destination: '/auth/sign-in',
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}

type SkillOption = {
  id: string
  year: number
}

const getYearLabel = (year: number) => {
  if (year === 0) {
    return 'Less than 1 year'
  }

  if (year === 1) {
    return '1 year'
  }

  return `${year} years`
}

const SkillIndexPage: NextPage = () => {
  const utils = trpc.useContext()
  const { data, isLoading } = trpc.technology.getAllUnpaginated.useQuery()
  const { data: userSkills } = trpc.skill.userSkills.useQuery()
  const { mutate, isLoading: isUpserting } =
    trpc.skill.upsertUserSkill.useMutation({
      onSuccess: async () => {
        await utils.skill.userSkills.invalidate()
      }
    })
  const { mutate: deleteSkill, isLoading: isDeleting } =
    trpc.skill.removeSkill.useMutation({
      onSuccess: async () => {
        await utils.skill.userSkills.invalidate()
      }
    })

  const [creatingSkills, setCreatingSkills] = useState<Array<SkillOption>>([])
  const [updatingSkills, setUpdatingSkills] = useState<Array<SkillOption>>([])

  useEffect(() => {
    if (!data || !userSkills) {
      return
    }

    const userSkillsIds = userSkills.map((skill) => skill.skillId)
    const nonSkills = data?.filter((skill) => {
      return !userSkillsIds.includes(skill.id)
    })

    setCreatingSkills(
      nonSkills.map((skill) => ({
        id: skill.id,
        year: 0
      }))
    )

    setUpdatingSkills(
      userSkills.map((skill) => ({
        id: skill.skillId,
        year: skill.years
      }))
    )
  }, [data, userSkills])

  const handleSkill = (skill: SkillOption) => {
    mutate({
      skill: skill.id,
      years: skill.year
    })
  }

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <DashboardTemplate>
          <Skeleton
            height={'xl'}
            width={'full'}
            color={'white'}
            isLoaded={!isLoading}
          >
            <Accordion allowToggle>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <Text fontSize={'2xl'} mt={2} mb={2}>
                        Registered skills
                      </Text>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>

                <AccordionPanel>
                  <Flex direction={'column'} gap={4}>
                    {updatingSkills?.map((userSkill) => (
                      <Box
                        key={userSkill.id}
                        p={5}
                        shadow={'md'}
                        borderWidth={'1px'}
                      >
                        <Flex
                          direction={{ base: 'column', lg: 'row' }}
                          align={{ base: 'flex-start', lg: 'center' }}
                          justifyContent={'space-between'}
                          gap={4}
                        >
                          <Text>
                            {data?.find((d) => d.id === userSkill.id)?.title}
                          </Text>

                          <Flex
                            direction={{ base: 'column', lg: 'row' }}
                            align={{ base: 'flex-start' }}
                            justifyContent={'space-between'}
                            gap={2}
                            width={{ base: 'full', md: '36', lg: 'xl' }}
                          >
                            <Select
                              width={{ base: '100%' }}
                              value={userSkill.year}
                              onChange={(event) => {
                                const year = parseInt(event.target.value, 10)
                                setUpdatingSkills((prev) => {
                                  return prev.map((prevSkill) => {
                                    if (prevSkill.id === userSkill.id) {
                                      return {
                                        id: prevSkill.id,
                                        year
                                      }
                                    }

                                    return prevSkill
                                  })
                                })
                              }}
                            >
                              {Array.from({ length: 6 }, (_, k) => k).map(
                                (year) => (
                                  <option
                                    key={`skill-option-${userSkill.id}-${year}`}
                                    value={year}
                                  >
                                    {getYearLabel(year)}
                                  </option>
                                )
                              )}
                            </Select>

                            <Button
                              colorScheme="teal"
                              width={{ base: '100%', lg: '24' }}
                              disabled={isDeleting || isUpserting}
                              isLoading={isUpserting}
                              onClick={() => {
                                handleSkill({
                                  id: userSkill.id,
                                  year: userSkill.year
                                })
                              }}
                            >
                              Update
                            </Button>

                            <Button
                              colorScheme="red"
                              width={{ base: '100%', lg: '24' }}
                              disabled={isDeleting || isUpserting}
                              isLoading={isDeleting}
                              onClick={() => {
                                deleteSkill({
                                  skill: userSkill.id
                                })
                              }}
                            >
                              Remove
                            </Button>
                          </Flex>
                        </Flex>
                      </Box>
                    ))}
                  </Flex>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <Text fontSize={'2xl'} mt={2} mb={2}>
                        Not registered skills
                      </Text>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>

                <AccordionPanel>
                  <Flex direction={'column'} gap={4}>
                    {creatingSkills.map((skill) => (
                      <Box
                        key={skill.id}
                        p={5}
                        shadow={'md'}
                        borderWidth={'1px'}
                      >
                        <Flex
                          direction={{ base: 'column', lg: 'row' }}
                          align={{ base: 'flex-start', lg: 'center' }}
                          justifyContent={'space-between'}
                          gap={4}
                        >
                          <Text>
                            {data?.find((d) => d.id === skill.id)?.title}
                          </Text>

                          <Flex
                            direction={{ base: 'column', lg: 'row' }}
                            align={{ base: 'flex-start' }}
                            justifyContent={'space-between'}
                            gap={2}
                            width={{ base: 'full', md: '36', lg: 'xl' }}
                          >
                            <Select
                              width={{ base: '100%' }}
                              value={skill.year}
                              onChange={(event) => {
                                const year = parseInt(event.target.value, 10)
                                setCreatingSkills((prev) => {
                                  return prev.map((prevSkill) => {
                                    if (prevSkill.id === skill.id) {
                                      return {
                                        id: prevSkill.id,
                                        year
                                      }
                                    }

                                    return prevSkill
                                  })
                                })
                              }}
                            >
                              {Array.from({ length: 6 }, (_, k) => k).map(
                                (year) => (
                                  <option
                                    key={`skill-option-${skill.id}-${year}`}
                                    value={year}
                                  >
                                    {getYearLabel(year)}
                                  </option>
                                )
                              )}
                            </Select>
                            <Button
                              colorScheme="teal"
                              width={{ base: '100%', lg: '24' }}
                              onClick={() => handleSkill(skill)}
                              disabled={isUpserting}
                              isLoading={isUpserting}
                            >
                              Add
                            </Button>
                          </Flex>
                        </Flex>
                      </Box>
                    ))}
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Skeleton>
        </DashboardTemplate>
      </main>
    </>
  )
}

export default SkillIndexPage