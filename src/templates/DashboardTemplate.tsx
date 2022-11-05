import type { BoxProps, FlexProps } from '@chakra-ui/react'
import {
  Box,
  CloseButton,
  Divider,
  Drawer,
  DrawerContent,
  Flex,
  Link,
  Text,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react'
import NextLink from 'next/link'
import type { ReactNode } from 'react'
import MobileNav from '../components/MobileNav'

interface LinkItemProps {
  name: string
  url: string
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', url: '/' },
  { name: 'Dashboard', url: '/dashboard' },
  { name: 'Company', url: '/#' },
  { name: 'Jobs', url: '/jobs' }
]

const AdminItems: Array<LinkItemProps> = [
  { name: 'Technologies', url: '/dashboard/technologies' }
]

export default function DashboardTemplate({
  children
}: {
  children: ReactNode
}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  )
}

interface SidebarProps extends BoxProps {
  onClose: () => void
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          T3 Jobs
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>

      {LinkItems.map((link) => (
        <NavItem key={link.name} href={link.url}>
          {link.name}
        </NavItem>
      ))}
      <Divider my={2} />
      {AdminItems.map((link) => (
        <NavItem key={link.name} href={link.url}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  )
}

interface NavItemProps extends FlexProps {
  href: string
  children: ReactNode
}

const NavItem = ({ children, href, ...rest }: NavItemProps) => {
  return (
    <NextLink href={href} legacyBehavior passHref>
      <Link style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          _hover={{
            bg: 'cyan.400',
            color: 'white'
          }}
          {...rest}
        >
          {children}
        </Flex>
      </Link>
    </NextLink>
  )
}
