import {
  Box,
  Table,
  Heading,
  Spinner,
  Alert,
  Badge,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services/api';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  age: number;
  address: {
    city: string;
  };
}

export default function UsersPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAll(20, 0),
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt="10">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert.Root status="error">
        <Alert.Indicator />
        <Alert.Description>خطا در بارگذاری کاربران</Alert.Description>
      </Alert.Root>
    );
  }

  return (
    <Box>
      <Heading mb="6" size="lg">مدیریت کاربران</Heading>

      <Table.Root colorScheme="blue">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>#</Table.ColumnHeader>
            <Table.ColumnHeader>نام</Table.ColumnHeader>
            <Table.ColumnHeader>ایمیل</Table.ColumnHeader>
            <Table.ColumnHeader>جنسیت</Table.ColumnHeader>
            <Table.ColumnHeader>سن</Table.ColumnHeader>
            <Table.ColumnHeader>شهر</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data?.users?.map((user: User, index: number) => (
            <Table.Row key={user.id}>
              <Table.Cell>{index + 1}</Table.Cell>
              <Table.Cell>{user.firstName} {user.lastName}</Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>
                <Badge colorScheme={user.gender === 'female' ? 'pink' : 'blue'}>
                  {user.gender === 'female' ? 'زن' : 'مرد'}
                </Badge>
              </Table.Cell>
              <Table.Cell>{user.age}</Table.Cell>
              <Table.Cell>{user.address?.city}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
