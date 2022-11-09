import {
  Box,
  Center,
  Container,
  Flex,
  Skeleton,
  Tag,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import {
  IconBuilding,
  IconGlobe,
  IconLocation,
  IconMoneybag
} from '@tabler/icons'
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Navigation from '../../components/Navigation'
import { formatPrice } from '../../utils/format_price'
import { trpc } from '../../utils/trpc'

const JobPage: NextPage = () => {
  const { query, isReady, push } = useRouter()
  const { data, isLoading } = trpc.job.publicJob.useQuery(
    {
      id: query.id as string
    },
    {
      enabled: isReady,
      onError: async () => {
        await push('/404')
      }
    }
  )

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Box w={'100vw'} h={'100vh'}>
          <Navigation />

          <Skeleton
            height={'xl'}
            width={'full'}
            color={'white'}
            isLoaded={!isLoading || !!data}
          >
            <Box p={10} bg={useColorModeValue('gray.100', 'gray.700')}>
              <Center>
                <Text fontSize={'4xl'}>{data?.title}</Text>
              </Center>
              <Center>
                <Flex direction={'row'} gap={2}>
                  {data?.technologies.map((tech) => (
                    <Link key={tech.id} href={`/technology/${tech.slug}`}>
                      <Tag size={'md'}>{tech.title}</Tag>
                    </Link>
                  ))}
                </Flex>
              </Center>
            </Box>

            <Container maxW={'6xl'} mt={10}>
              <Box p={4} bg={useColorModeValue('gray.100', 'gray.700')}>
                <Text fontSize={'2xl'}>{data?.company.name}</Text>

                <Flex direction={{ base: 'column' }} gap={2} pt={4}>
                  <Flex direction={'row'} align={'center'} gap={2}>
                    <IconBuilding size={'16'} />
                    <Text>{data?.company.size}</Text>
                  </Flex>

                  <Flex direction={'row'} align={'center'} gap={2}>
                    <IconLocation size={'16'} />
                    <Text>{data?.company.location}</Text>
                  </Flex>

                  <Flex direction={'row'} align={'center'} gap={2}>
                    <IconMoneybag size={'16'} />
                    <Text>{formatPrice(data?.salary ?? 0)}</Text>
                  </Flex>

                  <Flex direction={'row'} align={'center'} gap={2}>
                    <IconGlobe size={'16'} />
                    <Text>{data?.remote ? 'Remote Job' : 'On-site Job'}</Text>
                  </Flex>

                  <Flex direction={'row'} align={'center'} gap={2}>
                    <IconGlobe size={'16'} />
                    <Text>{data?.level}</Text>
                  </Flex>
                </Flex>
              </Box>

              <Flex direction={{ base: 'column' }} pt={8} gap={2}>
                <Text fontSize={'2xl'}>About the company</Text>
                <Text textAlign={'justify'}>{data?.company.about}</Text>
              </Flex>

              <Flex direction={{ base: 'column' }} pt={8} gap={2}>
                <Text fontSize={'2xl'}>About the job</Text>
                <Text textAlign={'justify'}>{data?.description}</Text>
              </Flex>

              <Flex direction={{ base: 'column' }} pt={8} gap={2}>
                <Text fontSize={'2xl'}>Job requirements</Text>
                <Text textAlign={'justify'}>{data?.requirements}</Text>
              </Flex>
            </Container>
          </Skeleton>
        </Box>
      </main>
    </>
  )
}

export default JobPage
