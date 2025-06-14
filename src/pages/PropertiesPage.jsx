// src/pages/user/PropertiesPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  SimpleGrid, // Still needed for filter layout
  Spinner,
  Stack,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
//import PropertyCard from '../../../components/PropertyCard'; // Path if directly imported
import useDebounce from '../hooks/useDebounce'; // <--- CORRECTED PATH
import PropertyList from '../components/PropertyList'; // <--- CORRECTED PATH

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTermInput, setSearchTermInput] = useState('');
  const debouncedSearchTerm = useDebounce(searchTermInput, 500);

  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    propertyType: '',
  });
  const [sortOptions, setSortOptions] = useState({
    sortBy: 'dateAdded',
    sortOrder: 'desc',
  });


  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    const queryParams = new URLSearchParams();

    if (debouncedSearchTerm) queryParams.append('search', debouncedSearchTerm);
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
    if (filters.bedrooms) queryParams.append('bedrooms', filters.bedrooms);
    if (filters.propertyType) queryParams.append('propertyType', filters.propertyType);
    if (sortOptions.sortBy) {
      queryParams.append('sortBy', sortOptions.sortBy);
      queryParams.append('sortOrder', sortOptions.sortOrder);
    }

    const queryString = queryParams.toString();
    try {
      const response = await fetch(`${API_BASE_URL}/api/properties${queryString ? `?${queryString}` : ''}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP Error: ${response.status}` }));
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }
      const data = await response.json();
      setProperties(data);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
      setError(err.message || 'Failed to fetch properties.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, filters, sortOptions]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleSearchChange = (e) => {
    setSearchTermInput(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSortChange = (e) => {
    const { name, value } = e.target;
    setSortOptions(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setSearchTermInput('');
    setFilters({ minPrice: '', maxPrice: '', bedrooms: '', propertyType: '' });
    setSortOptions({ sortBy: 'dateAdded', sortOrder: 'desc' });
  };

  return (
    <Box
      width="100%"
      px={{ base: 4, md: 6, lg: 8 }}
      py={{ base: 4, md: 8 }}
      display="flex"
      flexDirection="column"
      flex="1"
    >
      <Stack spacing={6} mb={8}>
        <Heading as="h1" size="xl" textAlign="center">
          Explore Properties
        </Heading>
        <Text fontSize="lg" color="gray.600" textAlign="center">
          Find your next dream home or investment.
        </Text>
      </Stack>

      {/* Filters and Search Section */}
      <Box p={{ base: 3, md: 4 }} shadow="md" borderWidth="1px" borderRadius="md" mb={8} bg="darkgreen">
        <Stack spacing={{ base: 3, md: 4 }}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 3, md: 4 }}>
            {/* Search Bar */}
            <FormControl>
              <FormLabel htmlFor="searchTermInput" fontSize={{ base: "sm", md: "md" }}>Search Properties</FormLabel>
              <InputGroup size={{ base: "sm", md: "md" }}>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  id="searchTermInput"
                  placeholder="Keywords (e.g., villa, park view)"
                  value={searchTermInput}
                  onChange={handleSearchChange}
                  bg="white"
                  fontSize={{ base: "sm", md: "md" }}
                />
              </InputGroup>
            </FormControl>

            {/* Min Price */}
            <FormControl>
              <FormLabel htmlFor="minPrice" fontSize={{ base: "sm", md: "md" }}>Min Price</FormLabel>
              <Input
                id="minPrice"
                name="minPrice"
                type="number"
                placeholder="e.g., 100000"
                value={filters.minPrice}
                onChange={handleFilterChange}
                bg="white"
                size={{ base: "sm", md: "md" }}
                fontSize={{ base: "sm", md: "md" }}
              />
            </FormControl>

            {/* Max Price */}
            <FormControl>
              <FormLabel htmlFor="maxPrice" fontSize={{ base: "sm", md: "md" }}>Max Price</FormLabel>
              <Input
                id="maxPrice"
                name="maxPrice"
                type="number"
                placeholder="e.g., 500000"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                bg="white"
                size={{ base: "sm", md: "md" }}
                fontSize={{ base: "sm", md: "md" }}
              />
            </FormControl>

            {/* Bedrooms */}
            <FormControl>
              <FormLabel htmlFor="bedrooms" fontSize={{ base: "sm", md: "md" }}>Bedrooms (min)</FormLabel>
              <Input
                id="bedrooms"
                name="bedrooms"
                type="number"
                min="0"
                placeholder="e.g., 3"
                value={filters.bedrooms}
                onChange={handleFilterChange}
                bg="white"
                size={{ base: "sm", md: "md" }}
                fontSize={{ base: "sm", md: "md" }}
              />
            </FormControl>

            {/* Property Type */}
            <FormControl>
              <FormLabel htmlFor="propertyType" fontSize={{ base: "sm", md: "md" }}>Property Type</FormLabel>
              <Select
                id="propertyType"
                name="propertyType"
                value={filters.propertyType}
                onChange={handleFilterChange}
                placeholder="All Types"
                bg="white"
                size={{ base: "sm", md: "md" }}
                fontSize={{ base: "sm", md: "md" }}
              >
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
              </Select>
            </FormControl>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 3, md: 4 }} mt={1}>
            {/* Sort By */}
            <FormControl>
              <FormLabel htmlFor="sortBy" fontSize={{ base: "sm", md: "md" }}>Sort By</FormLabel>
              <Select
                id="sortBy"
                name="sortBy"
                value={sortOptions.sortBy}
                onChange={handleSortChange}
                bg="white"
                size={{ base: "sm", md: "md" }}
                fontSize={{ base: "sm", md: "md" }}
              >
                <option value="dateAdded">Date Added</option>
                <option value="price">Price</option>
                <option value="area">Area</option>
                <option value="bedrooms">Bedrooms</option>
              </Select>
            </FormControl>

            {/* Order */}
            <FormControl>
              <FormLabel htmlFor="sortOrder" fontSize={{ base: "sm", md: "md" }}>Order</FormLabel>
              <Select
                id="sortOrder"
                name="sortOrder"
                value={sortOptions.sortOrder}
                onChange={handleSortChange}
                bg="white"
                size={{ base: "sm", md: "md" }}
                fontSize={{ base: "sm", md: "md" }}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </Select>
            </FormControl>
          </SimpleGrid>

          <Button onClick={clearFilters} colorScheme="gray" variant="outline" mt={2} size={{ base: "sm", md: "md" }}>
            Clear All Filters
          </Button>
        </Stack>
      </Box>

      {/* Display Area for Properties, Loading, Error */}
       {loading && (
          <Flex
            flex="1"
            justifyContent="center"
            alignItems="center"
            minHeight="calc(100vh - 350px)"
            width="100%"
          >
          <Spinner size="xl" thickness="4px" speed="0.65s" emptyColor="gray.200" color="teal.500" />
          <Text ml={3}>Loading properties...</Text>
        </Flex>
      )}

        {error && !loading && (
          <Flex flex="1" justify="center" align="center" p={5} minHeight={{ base: "300px", md: "400px" }}>
            <Alert status="error" borderRadius="md" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" py={10}>
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="xl">Error Fetching Properties!</AlertTitle>
              <AlertDescription maxWidth="sm">{error}</AlertDescription>
            </Alert>
          </Flex>
      )}

      {!loading && !error && (
        <PropertyList properties={properties} />
      )}

    </Box>
  );
};

export default PropertiesPage;