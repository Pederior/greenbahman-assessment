import {
  Box,
  Flex,
  HStack,
  IconButton,
  Text,
  Drawer,
  Menu,
} from '@chakra-ui/react';
import { FiMenu, FiUsers, FiShoppingBag, FiLogOut } from 'react-icons/fi';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/authStore';
import { useState } from 'react';

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const NavItem = ({ to, icon, children }: NavLinkProps) => {
  return (
    <NavLink
      to={to}
      style={{ textDecoration: 'none' }}
    >
      {({ isActive }) => (
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          bg={isActive ? 'blue.50' : 'transparent'}
          color={isActive ? 'blue.600' : 'inherit'}
          _hover={{
            bg: 'blue.50',
            color: 'blue.600',
          }}
        >
          {icon && <Box mr="4">{icon}</Box>}
          {children}
        </Flex>
      )}
    </NavLink>
  );
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box minH="100vh" bg="gray.100">
      {/* سایدبار موبایل */}
      <Drawer.Root open={drawerOpen} onOpenChange={(e) => setDrawerOpen(e.open)}>
        <Drawer.Trigger asChild>
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            variant="outline"
            aria-label="open menu"
          >
            <FiMenu />
          </IconButton>
        </Drawer.Trigger>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <SidebarContent />
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>

      {/* هدر موبایل */}
      <Flex
        ml={{ base: 0, md: 60 }}
        px={{ base: 4, md: 4 }}
        height="20"
        alignItems="center"
        bg="white"
        borderBottomWidth="1px"
        borderBottomColor="gray.200"
        justifyContent={{ base: 'space-between', md: 'flex-end' }}
      >
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          variant="outline"
          aria-label="open menu"
          onClick={() => setDrawerOpen(true)}
        >
          <FiMenu />
        </IconButton>

        <HStack gap={{ base: '0', md: '6' }}>
          <Flex alignItems="center">
            <Menu.Root>
              <Menu.Trigger asChild>
                <Text fontSize="sm" fontWeight="medium" cursor="pointer">
                  {user?.username || 'کاربر'}
                </Text>
              </Menu.Trigger>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item value="logout" onClick={handleLogout}>
                    <FiLogOut />
                    خروج
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>
          </Flex>
        </HStack>
      </Flex>

      {/* سایدبار دسکتاپ */}
      <Box
        display={{ base: 'none', md: 'block' }}
        pos="fixed"
        h="100%"
        w="60"
        bg="white"
        borderRightWidth="1px"
        borderRightColor="gray.200"
      >
        <SidebarContent />
      </Box>

      {/* محتوای اصلی */}
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

function SidebarContent() {
  return (
    <Box
      transition="3s ease"
      bg="white"
      borderRightWidth="1px"
      borderRightColor="gray.200"
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold" color="blue.600">
          داشبورد
        </Text>
      </Flex>

      <NavItem to="/dashboard/users" icon={<FiUsers />}>کاربران</NavItem>
      <NavItem to="/dashboard/products" icon={<FiShoppingBag />}>محصولات</NavItem>
    </Box>
  );
}
