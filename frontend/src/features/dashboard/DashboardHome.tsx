import { Link } from 'react-router-dom';
import {
  Box,
  SimpleGrid,
  Card,
  Heading,
  Text,
  Icon,
} from '@chakra-ui/react';
import { FiUsers, FiShoppingBag, FiMonitor } from 'react-icons/fi';

export default function DashboardHome() {
  const menuItems = [
    { title: 'کاربران', path: '/dashboard/users', icon: FiUsers, color: 'blue' },
    { title: 'محصولات', path: '/dashboard/products', icon: FiShoppingBag, color: 'green' },
    { title: 'فروشگاه بازی', path: '/games', icon: FiMonitor, color: 'purple' },
  ];

  return (
    <Box p="4">
      <Heading mb="6" size="lg">به داشبورد خوش آمدید</Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
        {menuItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <Card.Root
              p="6"
              cursor="pointer"
              _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
              transition="all 0.2s"
            >
              <Card.Body>
                <Icon as={item.icon} boxSize="8" color={`${item.color}.500`} mb="4" />
                <Heading size="md" mb="2">{item.title}</Heading>
                <Text color="gray.500">مدیریت و مشاهده {item.title}</Text>
              </Card.Body>
            </Card.Root>
          </Link>
        ))}
      </SimpleGrid>
    </Box>
  );
}