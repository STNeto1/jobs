import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react'
import { IconMenu2, IconX } from '@tabler/icons'
import { signOut, useSession } from 'next-auth/react'
import NextLink from 'next/link'

interface NavItem {
  label: string
  href?: string
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Dashboard',
    href: '/dashboard'
  },
  {
    label: 'Jobs',
    href: '/jobs'
  }
]

const DesktopNav = () => {
  const linkColor = useColorModeValue('gray.600', 'gray.200')
  const linkHoverColor = useColorModeValue('gray.800', 'white')

  return (
    <Stack direction={'row'} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <NextLink href={navItem.href ?? '#'} passHref legacyBehavior>
            <Link
              p={2}
              fontSize={'sm'}
              fontWeight={500}
              color={linkColor}
              _hover={{
                textDecoration: 'none',
                color: linkHoverColor
              }}
            >
              {navItem.label}
            </Link>
          </NextLink>
        </Box>
      ))}
    </Stack>
  )
}

const Navigation = () => {
  const { isOpen, onToggle } = useDisclosure()
  const { data: session } = useSession()

  const bg = useColorModeValue('gray.100', 'gray.900')
  const linkBg = useColorModeValue('gray.200', 'gray.700')

  return (
    <Box position={'sticky'}>
      <Flex
        bg={bg}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}
      >
        <Flex
          flex={{ md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <IconX /> : <IconMenu2 />}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Text
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily={'heading'}
            color={useColorModeValue('gray.800', 'white')}
          >
            T3 Jobs
          </Text>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        {Boolean(session) ? (
          <>
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}
              >
                <Avatar size={'sm'} src={session?.user?.image ?? undefined} />
              </MenuButton>
              <MenuList>
                <MenuDivider />
                <MenuItem
                  onClick={() =>
                    signOut({
                      callbackUrl: '/'
                    })
                  }
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </>
        ) : (
          <Stack
            flex={{ base: 1, md: 0 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={6}
          >
            <NextLink href={'/auth/sign-in'} passHref legacyBehavior>
              <Button
                as={'a'}
                display={{ base: 'none', md: 'inline-flex' }}
                fontSize={'sm'}
                fontWeight={600}
                color={'white'}
                bg={'pink.400'}
                _hover={{
                  bg: 'pink.300'
                }}
              >
                Sign In
              </Button>
            </NextLink>
          </Stack>
        )}
      </Flex>

      {isOpen ? (
        <Box bg={bg} px={4} pt={2}>
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {NAV_ITEMS.map((link) => (
                <NextLink
                  key={link.href ?? Math.random().toString()}
                  href={link.href ?? '#'}
                  passHref
                  legacyBehavior
                >
                  <Link
                    px={2}
                    py={1}
                    rounded={'md'}
                    _hover={{
                      textDecoration: 'none',
                      bg: linkBg
                    }}
                  >
                    {link.label}
                  </Link>
                </NextLink>
              ))}
            </Stack>
          </Box>
        </Box>
      ) : null}
    </Box>
  )
}

export default Navigation
