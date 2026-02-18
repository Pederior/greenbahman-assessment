import {
  Box,
  SimpleGrid,
  Card,
  Image,
  Heading,
  Text,
  Badge,
  Spinner,
  Alert,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../../services/api';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnail: string;
}

export default function ProductsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll(20, 0),
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
        <Alert.Description>خطا در بارگذاری محصولات</Alert.Description>
      </Alert.Root>
    );
  }

  return (
    <Box>
      <Heading mb="6" size="lg">محصولات</Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
        {data?.products?.map((product: Product) => (
          <Card.Root key={product.id} overflow="hidden">
            <Image
              objectFit="cover"
              h="200px"
              w="full"
              src={product.thumbnail}
              alt={product.title}
            />
            <Card.Body>
              <Heading size="md" mb="2">{product.title}</Heading>
              <Text color="gray.600" mb="2">{product.description?.substring(0, 100)}...</Text>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Badge colorScheme="green" fontSize="lg">${product.price}</Badge>
                <Badge colorScheme="blue">{product.category}</Badge>
              </Box>
            </Card.Body>
          </Card.Root>
        ))}
      </SimpleGrid>
    </Box>
  );
}
