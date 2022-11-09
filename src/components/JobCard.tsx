import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Stack,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import { CompanySize, JobLevel } from '@prisma/client'
import {
  IconBriefcase,
  IconBuilding,
  IconLocation,
  IconPin
} from '@tabler/icons'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

type JobCardProps = {
  id: string
  title: string
  company: string
  location: string
  size: CompanySize
  remote: boolean
  level: JobLevel
}

export const CompanySizeLabel: Record<CompanySize, string> = {
  [CompanySize.LARGE]: 'Large',
  [CompanySize.MEDIUM]: 'Medium',
  [CompanySize.SMALL]: 'Small',
  [CompanySize.STARTUP]: 'Startup'
}

export const JobLevelLabel: Record<JobLevel, string> = {
  [JobLevel.JUNIOR]: 'Junior',
  [JobLevel.MID]: 'Mid',
  [JobLevel.SENIOR]: 'Senior'
}

const JobCard = ({
  id,
  company,
  location,
  remote,
  size,
  title,
  level
}: JobCardProps) => {
  return (
    <Link href={`/job/${id}`}>
      <Box
        maxW={'445px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'2xl'}
        rounded={'md'}
        p={4}
        overflow={'hidden'}
      >
        <Box
          h={'210px'}
          bg={'gray.100'}
          mt={-6}
          mx={-6}
          mb={6}
          pos={'relative'}
        >
          <Image
            src={
              'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
            }
            layout={'fill'}
            alt={'some alt'}
          />
        </Box>
        <Stack>
          <Heading
            color={useColorModeValue('gray.700', 'white')}
            fontSize={'2xl'}
            fontFamily={'body'}
          >
            {title}
          </Heading>

          <Grid rowGap={1}>
            <GridItem>
              <Feature
                title={company}
                icon={<IconBriefcase width={18} height={18} />}
              />
            </GridItem>
            <GridItem>
              <Feature
                title={location}
                icon={<IconPin width={18} height={18} />}
              />
            </GridItem>
            <GridItem>
              <Feature
                title={`${CompanySizeLabel[size]} company`}
                icon={<IconLocation width={18} height={18} />}
              />
            </GridItem>
            <GridItem>
              <Feature
                title={`${JobLevelLabel[level]} level`}
                icon={<IconBuilding width={18} height={18} />}
              />
            </GridItem>
            <GridItem>
              <Feature
                title={remote ? 'Remote' : 'On-site'}
                icon={<IconLocation width={18} height={18} />}
              />
            </GridItem>
          </Grid>
        </Stack>
      </Box>
    </Link>
  )
}

type FeatureProps = {
  title: string
  icon: ReactNode
}

const Feature = ({ title, icon }: FeatureProps) => {
  return (
    <Flex align={'center'} gap={2}>
      {icon}
      <Text noOfLines={1}>{title}</Text>
    </Flex>
  )
}

export default JobCard
