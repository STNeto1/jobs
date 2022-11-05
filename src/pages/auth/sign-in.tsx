import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import { IconBrandDiscord, IconBrandFacebook } from '@tabler/icons'
import type { GetServerSidePropsContext, NextPage } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { signIn } from 'next-auth/react'
import Head from 'next/head'
import { authOptions } from '../api/auth/[...nextauth]'

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  )

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}

const SignInPage: NextPage = () => {
  const handleSignIn = (provider: string) => {
    signIn(provider, {
      callbackUrl: '/'
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
        <Flex
          minH={'100vh'}
          align={'center'}
          justify={'center'}
          bg={useColorModeValue('gray.50', 'gray.800')}
        >
          <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
            <Stack align={'center'}>
              <Heading fontSize={'4xl'}>Sign in to your account</Heading>
            </Stack>
            <Box
              rounded={'lg'}
              bg={useColorModeValue('white', 'gray.700')}
              boxShadow={'lg'}
              p={8}
            >
              <Stack spacing={4}>
                <Button
                  w={'full'}
                  colorScheme={'gray'}
                  leftIcon={<IconBrandDiscord />}
                  onClick={() => handleSignIn('discord')}
                >
                  <Center>
                    <Text>Continue with Discord</Text>
                  </Center>
                </Button>
                <Button
                  w={'full'}
                  colorScheme={'gray'}
                  leftIcon={<IconBrandFacebook />}
                  disabled
                >
                  <Center>
                    <Text>Continue with Facebook</Text>
                  </Center>
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Flex>
      </main>
    </>
  )
}

export default SignInPage
