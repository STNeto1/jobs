import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  Skeleton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Text,
  Textarea
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { CompanySize, JobLevel } from '@prisma/client'
import { IconAlphabetLatin, IconLocation, IconReportMoney } from '@tabler/icons'
import type { GetServerSidePropsContext, NextPage } from 'next'
import { unstable_getServerSession } from 'next-auth'
import Head from 'next/head'
import { useRouter } from 'next/router'
import type { ChangeEvent } from 'react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import Pagination from '../../components/Pagination'
import { upsertCompany } from '../../server/trpc/inputs/company'
import { upsertJob } from '../../server/trpc/inputs/job'
import DashboardTemplate from '../../templates/DashboardTemplate'
import { formatPrice } from '../../utils/format_price'
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

const CompanyIndexPage: NextPage = () => {
  const isLoading = false

  const [hasCompany, setHasCompany] = useState(false)

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
            <Tabs variant="enclosed">
              <TabList>
                <Tab>Company Info</Tab>
                <Tab isDisabled={!hasCompany}>Create Job</Tab>
                <Tab isDisabled={!hasCompany}>List Company Jobs</Tab>
              </TabList>

              <TabPanels p="1rem">
                <TabPanel>
                  <UpdateCompanyForm
                    setHasCompany={(val) => setHasCompany(val)}
                  />
                </TabPanel>
                <TabPanel>
                  <CreateJobForm />
                </TabPanel>
                <TabPanel>
                  <ListCompanyJobs />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Skeleton>
        </DashboardTemplate>
      </main>
    </>
  )
}

type UpdateCompanyFormProps = {
  setHasCompany: (hasCompany: boolean) => void
}

type UpdateCompanyFormInput = z.infer<typeof upsertCompany>
const UpdateCompanyForm = ({ setHasCompany }: UpdateCompanyFormProps) => {
  const utils = trpc.useContext()

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue
  } = useForm<UpdateCompanyFormInput>({
    resolver: zodResolver(upsertCompany)
  })

  const { data } = trpc.company.userCompany.useQuery(undefined, {
    onSuccess: (data) => {
      setHasCompany(!!data)
      if (!data) {
        return
      }

      setValue('name', data.name)
      setValue('size', data.size)
      setValue('location', data.location)
      setValue('about', data.about)
    }
  })

  const { mutate, isLoading: isUpserting } =
    trpc.company.upsertCompany.useMutation({})

  const onSubmit = handleSubmit((data) =>
    mutate(data, {
      onSuccess: async () => {
        await utils.company.userCompany.invalidate()
        reset()
      }
    })
  )

  return (
    <>
      <form onSubmit={onSubmit}>
        <Flex
          align={'flex-end'}
          direction={{ base: 'column', lg: 'row' }}
          gap={4}
        >
          <FormControl isInvalid={!!errors.name}>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input id="name" placeholder="name" {...register('name')} />
            <FormErrorMessage>
              {errors.name && errors.name.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.location}>
            <FormLabel htmlFor="location">Location</FormLabel>
            <Input
              id="location"
              placeholder="location"
              {...register('location')}
            />
            <FormErrorMessage>
              {errors.location && errors.location.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.size}>
            <FormLabel htmlFor="size">Company Size</FormLabel>
            <Select placeholder="Company Size" {...register('size')}>
              {Object.keys(CompanySize).map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Select>
            <FormErrorMessage>
              {errors.size && errors.size.message}
            </FormErrorMessage>
          </FormControl>
        </Flex>

        <FormControl isInvalid={!!errors.about} pt={4}>
          <FormLabel htmlFor="about">About</FormLabel>
          <Textarea id="about" placeholder="About" {...register('about')} />
          <FormErrorMessage>
            {errors.about && errors.about.message}
          </FormErrorMessage>
        </FormControl>

        <Flex pt={4} justify={'flex-end'}>
          <Button
            colorScheme="teal"
            isLoading={isUpserting}
            type="submit"
            w={'60'}
          >
            {!!data ? 'Update' : 'Create'}
          </Button>
        </Flex>
      </form>
    </>
  )
}

type CreateJobFormProps = z.infer<typeof upsertJob>
const CreateJobForm = () => {
  const maskPrice = (value: string): string => {
    const cleanValue = +value.replace(/\D+/g, '')
    const options = { style: 'currency', currency: 'USD' }
    return new Intl.NumberFormat('en-US', options).format(cleanValue / 100)
  }
  const parseMaskedPrice = (value: string): number => {
    const cleanValue = value.replaceAll('.', '').replace(',', '')

    if (cleanValue === '0') {
      return parseFloat(cleanValue)
    }
    return parseFloat(cleanValue.substring(1)) / 100
  }

  const utils = trpc.useContext()

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
    getValues
  } = useForm<CreateJobFormProps>({
    resolver: zodResolver(upsertJob),
    defaultValues: {
      technologies: []
    }
  })

  const [txtSalary, setTxtSalary] = useState('$')
  const [selectedTechnologies, setSelectedTechnologies] = useState<
    Array<string>
  >([])

  const { mutate, isLoading } = trpc.job.upsertJob.useMutation({})
  const { data } = trpc.technology.getAllUnpaginated.useQuery()

  const onSubmit = handleSubmit((data) => {
    mutate(data, {
      onSuccess: async () => {
        await utils.job.listCompanyJobs.invalidate()
        reset()
        setTxtSalary('$')
        setSelectedTechnologies([])
      }
    })
  })

  const handleChangedSalary = (e: ChangeEvent<HTMLInputElement>) => {
    setTxtSalary(maskPrice(e.target.value))
    setValue('salary', parseMaskedPrice(e.target.value))
  }

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target
    const technologies = getValues('technologies')

    if (checked) {
      setValue('technologies', [...technologies, value])
      setSelectedTechnologies((prev) => [...prev, value])
    } else {
      setValue(
        'technologies',
        technologies.filter((t) => t !== value)
      )
      setSelectedTechnologies((prev) => prev.filter((t) => t !== value))
    }
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <Flex align={'flex-end'} direction={{ base: 'column' }} gap={4}>
          <Flex
            align={'center'}
            direction={{ base: 'column', lg: 'row' }}
            gap={4}
            w={'full'}
          >
            <FormControl isInvalid={!!errors.title}>
              <FormLabel htmlFor="title">Title</FormLabel>
              <Input id="title" placeholder="Title" {...register('title')} />
              <FormErrorMessage>
                {errors.title && errors.title.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.location}>
              <FormLabel htmlFor="location">Location</FormLabel>
              <Input
                id="location"
                placeholder="Location"
                {...register('location')}
              />
              <FormErrorMessage>
                {errors.location && errors.location.message}
              </FormErrorMessage>
            </FormControl>
          </Flex>

          <Flex
            align={{ base: 'center', lg: 'baseline' }}
            direction={{ base: 'column', lg: 'row' }}
            gap={4}
            w={'full'}
          >
            <FormControl isInvalid={!!errors.level}>
              <FormLabel htmlFor="level">Level</FormLabel>
              <Select id="level" placeholder="Level" {...register('level')}>
                {Object.keys(JobLevel).map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>
                {errors.level && errors.level.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.technologies}>
              <FormLabel htmlFor="salary">Salary</FormLabel>
              <Input value={txtSalary} onChange={handleChangedSalary} />
              <FormErrorMessage>
                {errors.salary && errors.salary.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.remote}>
              <FormLabel htmlFor="remote">Remote</FormLabel>
              <Select {...register('remote')}>
                <option value={'1'}>Yes</option>
                <option value={'0'}>No</option>
              </Select>
              <FormErrorMessage>
                {errors.remote && errors.remote.message}
              </FormErrorMessage>
            </FormControl>
          </Flex>

          <FormControl isInvalid={!!errors.technologies}>
            <Box
              overflow={'scroll'}
              w={'full'}
              p={{ base: 0, lg: 2 }}
              borderWidth={'1px'}
            >
              <SimpleGrid columns={{ base: 1, lg: 5 }} gap={2}>
                {data?.map((tech) => (
                  <Box key={tech.id} p={2}>
                    <Checkbox
                      value={tech.id}
                      isChecked={selectedTechnologies.includes(tech.id)}
                      onChange={handleCheckboxChange}
                    >
                      {tech.title}
                    </Checkbox>
                  </Box>
                ))}
              </SimpleGrid>
              <FormErrorMessage>
                {errors.technologies && errors.technologies.message}
              </FormErrorMessage>
            </Box>
          </FormControl>

          <FormControl isInvalid={!!errors.description}>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Textarea
              id="description"
              placeholder="Description"
              {...register('description')}
            />
            <FormErrorMessage>
              {errors.description && errors.description.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.requirements}>
            <FormLabel htmlFor="requirements">Requirements</FormLabel>
            <Textarea
              id="requirements"
              placeholder="Requirements"
              {...register('requirements')}
            />
            <FormErrorMessage>
              {errors.requirements && errors.requirements.message}
            </FormErrorMessage>
          </FormControl>

          <Button
            colorScheme="teal"
            isLoading={isLoading}
            disabled={isLoading}
            type="submit"
            w={'60'}
          >
            Create
          </Button>
        </Flex>
      </form>
    </>
  )
}

const ListCompanyJobs = () => {
  const [page, setPage] = useState<number>(-1)
  const { isReady, query, push } = useRouter()
  const utils = trpc.useContext()

  const { data, error } = trpc.job.listCompanyJobs.useQuery(
    {
      limit: 10,
      page
    },
    {
      enabled: page !== -1
    }
  )

  const handlePagination = async (page: number) => {
    await push(`/dashboard/company?page=${page}`)
  }

  useEffect(() => {
    if (!isReady) {
      return
    }

    const _page = Number(query.page)
    if (!isNaN(_page)) {
      setPage(_page)
      return
    }

    setPage(1)
  }, [isReady, query])

  const { mutate: remove, isLoading: isRemoving } =
    trpc.job.deleteJob.useMutation({
      onSuccess: async () => {
        await utils.job.listCompanyJobs.invalidate()
      }
    })

  const handleRemove = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) {
      return
    }

    remove({ id })
  }

  return (
    <>
      {!!error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>{error.message}</AlertTitle>
        </Alert>
      )}

      <Accordion allowToggle pt={2}>
        {data?.data.map((job) => (
          <AccordionItem key={job.id}>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  {job.title}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} pt={2}>
              <Flex direction={'column'} gap={2}>
                <SimpleGrid
                  columns={{ base: 1, lg: 4 }}
                  gap={2}
                  pt={{ base: 2, lg: 4 }}
                  pb={{ base: 2, lg: 4 }}
                >
                  <Flex direction={'column'} gap={1}>
                    <Flex direction={'row'} align={'center'} gap={2}>
                      <IconLocation size={'16'} />
                      <Text fontSize={'sm'}>Location</Text>
                    </Flex>

                    <Text>{job.location}</Text>
                  </Flex>

                  <Flex direction={'column'} gap={1} pt={2}>
                    <Flex direction={'row'} align={'center'} gap={2}>
                      <IconReportMoney size={'16'} />
                      <Text fontSize={'sm'}>Salary</Text>
                    </Flex>

                    <Text>{formatPrice(job.salary)}</Text>
                  </Flex>

                  <Flex direction={'column'} gap={1} pt={2}>
                    <Flex direction={'row'} align={'center'} gap={2}>
                      <IconLocation size={'16'} />
                      <Text fontSize={'sm'}>Remote?</Text>
                    </Flex>

                    <Text>{job.remote ? 'Yes' : 'No'}</Text>
                  </Flex>

                  <Flex direction={'column'} gap={1} pt={2}>
                    <Flex direction={'row'} align={'center'} gap={2}>
                      <IconLocation size={'16'} />
                      <Text fontSize={'sm'}>Level</Text>
                    </Flex>

                    <Text>{job.level}</Text>
                  </Flex>
                </SimpleGrid>

                <Flex
                  direction={'column'}
                  gap={1}
                  pt={{ base: 2, lg: 4 }}
                  pb={{ base: 2, lg: 4 }}
                >
                  <Flex direction={'row'} align={'center'} gap={2}>
                    <IconAlphabetLatin size={'16'} />
                    <Text fontSize={'sm'}>Technologies</Text>
                  </Flex>

                  <Flex>
                    {job.technologies.map((tech) => (
                      <Tag key={tech.id} mr={1}>
                        {tech.title}
                      </Tag>
                    ))}
                  </Flex>
                </Flex>

                <Flex
                  direction={'column'}
                  gap={1}
                  pt={{ base: 2, lg: 4 }}
                  pb={{ base: 2, lg: 4 }}
                >
                  <Flex direction={'row'} align={'center'} gap={2}>
                    <IconAlphabetLatin size={'16'} />
                    <Text fontSize={'sm'}>Description</Text>
                  </Flex>

                  <Text>{job.description}</Text>
                </Flex>

                <Flex
                  direction={'column'}
                  gap={1}
                  pt={{ base: 2, lg: 4 }}
                  pb={{ base: 2, lg: 4 }}
                >
                  <Flex direction={'row'} align={'center'} gap={2}>
                    <IconAlphabetLatin size={'16'} />
                    <Text fontSize={'sm'}>Requirements</Text>
                  </Flex>

                  <Text>{job.requirements}</Text>
                </Flex>

                <Flex
                  direction={{ base: 'column', lg: 'row' }}
                  align={'center'}
                  justify={'flex-end'}
                  gap={1}
                >
                  <Button
                    colorScheme="teal"
                    width={{ base: '100%', lg: '24' }}
                    disabled
                  >
                    Update
                  </Button>

                  <Button
                    colorScheme="red"
                    width={{ base: '100%', lg: '24' }}
                    disabled={isRemoving}
                    isLoading={isRemoving}
                    onClick={() => handleRemove(job.id)}
                  >
                    Remove
                  </Button>
                </Flex>
              </Flex>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <Center pt={4}>
        <Pagination
          page={page}
          count={data?.pages ?? 0}
          onClick={(newPage) => handlePagination(newPage)}
        />
      </Center>
    </>
  )
}

export default CompanyIndexPage
