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
import {
  IconBriefcase,
  IconBuilding,
  IconPin,
  IconVersions
} from '@tabler/icons'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

const JobCard = () => {
  return (
    <Link href={'#'}>
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
            Typescript Developer
          </Heading>

          <Grid rowGap={1}>
            <GridItem>
              <Feature
                title={'Company X'}
                icon={<IconBriefcase width={18} height={18} />}
              />
            </GridItem>
            <GridItem>
              <Feature
                title={'São Paulo, São Paulo, Brazil'}
                icon={<IconPin width={18} height={18} />}
              />
            </GridItem>
            <GridItem>
              <Feature
                title={'Big Company'}
                icon={<IconBuilding width={18} height={18} />}
              />
            </GridItem>
            <GridItem>
              <Feature
                title={'Senior Level'}
                icon={<IconVersions width={18} height={18} />}
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