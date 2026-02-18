import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Field,
  Heading,
  Input,
  Stack,
  Card,
  createToaster,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuthStore } from './authStore';

const toaster = createToaster({
  placement: 'top-end',
  duration: 3000,
});

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post<LoginResponse>('/auth/login', { username, password });
      login(response.data.token, response.data.user);

      toaster.create({
        title: 'ورود موفق',
        description: 'به داشبورد خوش آمدید',
        type: 'success',
      });

      navigate('/dashboard');
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toaster.create({
        title: 'خطا در ورود',
        description: error.response?.data?.message || 'نام کاربری یا رمز عبور اشتباه است',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="md" centerContent minHeight="100vh">
      <Card.Root w="full" shadow="lg">
        <Card.Body>
          <Stack gap="4">
            <Heading textAlign="center" size="lg">ورود به داشبورد</Heading>

            <form onSubmit={handleSubmit}>
              <Stack gap="4">
                <Field.Root>
                  <Field.Label>نام کاربری</Field.Label>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="مثال: emilys"
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>رمز عبور</Field.Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="مثال: emilyspass"
                  />
                </Field.Root>

                <Button
                  type="submit"
                  colorPalette="blue"
                  loading={loading}
                  loadingText="در حال ورود..."
                  w="full"
                >
                  ورود
                </Button>
              </Stack>
            </form>

            <Box textAlign="center" fontSize="sm" color="gray.500">
              <span>:برای تست</span>
              <p> username = emilys, password = emilyspass</p>
            </Box>
          </Stack>
        </Card.Body>
      </Card.Root>
    </Container>
  );
}