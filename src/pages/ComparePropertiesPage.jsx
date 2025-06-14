// PropertyPro-Frontend/frontend/src/pages/ComparePropertiesPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Heading, Text, Spinner, Alert, AlertIcon, Button, Flex, Icon,
  Image, Link as ChakraLink, useToast, Center, VStack, HStack, Divider, Grid,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer
} from '@chakra-ui/react';
import {
  FaTrash, FaInfoCircle, FaBed, FaRulerCombined, FaDollarSign,
  FaBuilding, FaTags, FaMapMarkerAlt, FaCalendarAlt, FaBath
} from 'react-icons/fa';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useCompare } from '../context/CompareContext'; // Adjust path if CompareContext is elsewhere

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Helper to get nested value - robust against null/undefined obj or path
const getNestedValue = (obj, path) => {
  if (!obj || typeof obj !== 'object' || !path) return undefined;
  return path.split('.').reduce((acc, part) => (acc && typeof acc === 'object' && part in acc) ? acc[part] : undefined, obj);
};

const ComparePropertiesPage = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const [propertiesDetails, setPropertiesDetails] = useState([null, null]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  const fetchPropertyDetailsForComparison = useCallback(async (idsToFetch) => {
    if (!Array.isArray(idsToFetch) || idsToFetch.length !== 2) {
        setLoading(false);
        setPropertiesDetails([null, null]);
        return;
    }
    setLoading(true);
    setError(null);
    try {
      const promises = idsToFetch.map(id => {
        if (!id) return Promise.resolve(null);
        return fetch(`${API_BASE_URL}/api/properties/${id}`).then(async res => {
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: `Failed to fetch property with ID: ${id}` }));
            throw new Error(errorData.message || `HTTP Error: ${res.status} for ID: ${id}`);
          }
          return res.json();
        });
      });
      const results = await Promise.all(promises);
      setPropertiesDetails([results[0] || null, results[1] || null]);
    } catch (err) {
      console.error("Error fetching property details for comparison:", err);
      setError(err.message || 'Failed to load property details.');
      toast({
          title: "Error Loading Details",
          description: err.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right"
      });
      setPropertiesDetails([null,null]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (compareList && compareList.length === 2) {
      fetchPropertyDetailsForComparison(compareList);
    } else {
      setLoading(false);
      setPropertiesDetails([null,null]);
    }
  }, [compareList, fetchPropertyDetailsForComparison]);

  const handleRemoveAndReselect = (propertyIdToRemove) => {
    removeFromCompare(propertyIdToRemove);
    toast({ title: "One Property Removed", description: "Please select another property.", status: "info", duration: 3000, isClosable: true, position:"top-right" });
    navigate('/properties');
  };

  const handleStartNewComparison = () => {
    clearCompare();
    toast({ title: "Comparison Cleared", description: "Select new properties.", status: "info", duration: 3000, isClosable: true, position:"top-right" });
    navigate('/properties');
  };

  const [property1, property2] = propertiesDetails;
  const canCompare = property1 && typeof property1 === 'object' && property1._id &&
                     property2 && typeof property2 === 'object' && property2._id &&
                     compareList && compareList.length === 2;

  if (loading) {
    return ( <Center minH="calc(100vh - 200px)"><Spinner size="xl" thickness="4px" color="teal.500" emptyColor="gray.200"/><Text ml={3} fontSize="lg">Loading Comparison...</Text></Center>);
  }

  if (!canCompare) {
     if(error) {
        return (
            <Flex direction="column" align="center" justify="center" minH="calc(100vh - 200px)" p={5} textAlign="center">
              <Icon as={FaInfoCircle} boxSize="40px" color="red.500" mb={4} />
              <Heading as="h2" size="lg" mb={3}>Error Loading Comparison</Heading>
              <Text mb={2}>There was an issue fetching details for the properties.</Text>
              <Alert status="error" mb={6} maxW="lg" borderRadius="md" variant="subtle"><AlertIcon />{error}</Alert>
              <Button colorScheme="teal" onClick={handleStartNewComparison}>Try Again or Start New</Button>
            </Flex>
           );
     }
    return (
      <Flex direction="column" align="center" justify="center" minH="calc(100vh - 200px)" p={5} textAlign="center">
        <Icon as={FaInfoCircle} boxSize="40px" color="blue.500" mb={4} />
        <Heading as="h2" size="lg" mb={3}>Select Two Properties to Compare</Heading>
        <Text mb={6}>You currently have {compareList ? compareList.length : 0} properties selected.</Text>
        <Button colorScheme="teal" onClick={() => navigate('/properties')}>Browse Properties</Button>
      </Flex>
    );
  }

  // --- Features to Compare (Customize this list to match your property data structure) ---
  const featuresToCompare = [
    { key: 'price', label: 'Price', format: (val) => val != null ? `$${Number(val).toLocaleString()}` : 'N/A', icon: FaDollarSign, betterIf: 'lower' },
    { key: 'area', label: 'Area (sq m)', icon: FaRulerCombined, betterIf: 'higher' },
    { key: 'bedrooms', label: 'Bedrooms', icon: FaBed, betterIf: 'higher' },
    { key: 'bathrooms', label: 'Bathrooms', icon: FaBath, betterIf: 'higher' },
    { key: 'yearBuilt', label: 'Year Built', icon: FaCalendarAlt, betterIf: 'higher' },
    { key: 'propertyType', label: 'Type', format: (val) => val ? String(val).charAt(0).toUpperCase() + String(val).slice(1) : 'N/A', icon: FaBuilding },
    { key: 'status', label: 'Status', format: (val) => val ? String(val).charAt(0).toUpperCase() + String(val).slice(1) : 'N/A', icon: FaTags},
    { key: 'address.city', label: 'City', icon: FaMapMarkerAlt},
    { key: 'address.street', label: 'Street', icon: FaMapMarkerAlt},
    { key: 'description', label: 'Description', noOfLines: 3},
    { key: 'dateAdded', label: 'Listed On', format: (val) => val ? new Date(val).toLocaleDateString() : 'N/A', icon: FaCalendarAlt },
  ];

  return (
    <Box p={{ base: 4, md: 8 }} maxW="1200px" mx="auto">
      <Flex justifyContent="space-between" alignItems="center" mb={6} wrap="wrap" gap={2}>
        <Heading as="h1" size={{base: "lg", md: "xl"}} color="gray.700">Property Comparison</Heading>
        <Button colorScheme="orange" variant="outline" onClick={handleStartNewComparison} size="sm" borderWidth="2px">Start New Comparison</Button>
      </Flex>

      {/* --- Property Header CARDS section --- */}
      <Grid templateColumns={{ base: "1fr", md: "1fr auto 1fr" }} gap={{ base: 4, md: 6 }} alignItems="stretch" mb={8}>
        <VStack spacing={3} align="stretch" p={4} borderWidth="1px" borderRadius="xl" shadow="lg" bg="white" justifyContent="space-between">
          <Box>
            <RouterLink to={`/properties/${property1._id}`}>
              <Image
                src={property1.imageUrls && property1.imageUrls[0] ? property1.imageUrls[0] : "https://via.placeholder.com/350x220.png?text=No+Image"}
                alt={property1.title || "Property 1"}
                h={{base:"180px", md:"200px"}} w="100%" objectFit="cover" borderRadius="md" mb={3}
              />
              <Heading as="h3" size="md" color="blue.600" textAlign="center" noOfLines={2} _hover={{textDecoration:"underline"}} minH={{base:"auto", md:"3em"}}>
                {property1.title || "Property Information"}
              </Heading>
            </RouterLink>
            <Text fontSize="sm" color="gray.500" noOfLines={3} textAlign="center" mt={2} minH={{base:"auto", md:"4.5em"}}>
              {getNestedValue(property1, 'description')?.substring(0,100) || "No description available."}...
            </Text>
          </Box>
          <Button colorScheme="red" variant="ghost" size="sm" onClick={() => handleRemoveAndReselect(property1._id)} leftIcon={<FaTrash />} mt={3} alignSelf="center">Remove</Button>
        </VStack>
        <Center display={{ base: "none", md: "flex" }} alignSelf="center">
          <Text fontSize="4xl" fontWeight="bold" color="gray.300">VS</Text>
        </Center>
        <VStack spacing={3} align="stretch" p={4} borderWidth="1px" borderRadius="xl" shadow="lg" bg="white" justifyContent="space-between">
          <Box>
            <RouterLink to={`/properties/${property2._id}`}>
              <Image
                src={property2.imageUrls && property2.imageUrls[0] ? property2.imageUrls[0] : "https://via.placeholder.com/350x220.png?text=No+Image"}
                alt={property2.title || "Property 2"}
                h={{base:"180px", md:"200px"}} w="100%" objectFit="cover" borderRadius="md" mb={3}
              />
              <Heading as="h3" size="md" color="green.600" textAlign="center" noOfLines={2} _hover={{textDecoration:"underline"}} minH={{base:"auto", md:"3em"}}>
                {property2.title || "Property Information"}
              </Heading>
            </RouterLink>
            <Text fontSize="sm" color="gray.500" noOfLines={3} textAlign="center" mt={2} minH={{base:"auto", md:"4.5em"}}>
             {getNestedValue(property2, 'description')?.substring(0,100) || "No description available."}...
            </Text>
          </Box>
           <Button colorScheme="red" variant="ghost" size="sm" onClick={() => handleRemoveAndReselect(property2._id)} leftIcon={<FaTrash />} mt={3} alignSelf="center">Remove</Button>
        </VStack>
      </Grid>

      <Divider my={8} borderColor="gray.300" />

      {/* --- Features Comparison Table --- */}
      <TableContainer borderWidth="1px" borderRadius="lg" shadow="xl" bg="white" overflowX="auto">
        <Table variant="striped" colorScheme="gray" size={{ base: "sm", md: "md" }}>
          <Thead bg="gray.100" _dark={{bg: "gray.700"}}>
            <Tr>
              <Th
                p={{base:3, md:4}} minW={{base:"140px", md:"200px"}} position="sticky" left={0}
                bg="gray.100" _dark={{bg:"gray.700"}} zIndex={10}
                textTransform="uppercase" letterSpacing="wider" fontSize="xs" fontWeight="bold"
                color="gray.600" _light={{color:"gray.300"}}
                borderRightWidth="1px" borderColor="gray.300" _mix={{borderColor:"gray.600"}}
              >
                              </Th>
              <Th p={{base:3, md:4}} minW={{base:"120px", md:"180px"}} textAlign="center" _hover={{bg:"blue.50", _dark:{bg:"blue.800"}}}>
                <RouterLink to={`/properties/${property1._id}`}>
                    <Text fontWeight="bold" color="blue.600" _dark={{color:"blue.300"}} noOfLines={2}>{property1.title || "Property 1"}</Text>
                </RouterLink>
              </Th>
              <Th p={{base:3, md:4}} minW={{base:"120px", md:"180px"}} textAlign="center" _hover={{bg:"green.50", _dark:{bg:"green.800"}}}>
                 <RouterLink to={`/properties/${property2._id}`}>
                    <Text fontWeight="bold" color="green.600" _dark={{color:"green.300"}} noOfLines={2}>{property2.title || "Property 2"}</Text>
                </RouterLink>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {featuresToCompare.map((feature) => {
              const val1 = getNestedValue(property1, feature.key);
              const val2 = getNestedValue(property2, feature.key);

              const formatValue = (val, fmtFunc) => {
                if (val == null) return 'N/A';
                if (fmtFunc) return fmtFunc(val);
                if (typeof val === 'boolean') return val ? 'Yes' : 'No';
                if (typeof val === 'object') return JSON.stringify(val);
                return String(val);
              };

              const displayVal1 = formatValue(val1, feature.format);
              const displayVal2 = formatValue(val2, feature.format);

              let isVal1Better = false;
              let isVal2Better = false;

              if (val1 != null && val2 != null && JSON.stringify(val1) !== JSON.stringify(val2)) {
                if (feature.betterIf === 'higher') {
                  if (Number(val1) > Number(val2)) isVal1Better = true;
                  else if (Number(val2) > Number(val1)) isVal2Better = true;
                } else if (feature.betterIf === 'lower') {
                  if (Number(val1) < Number(val2)) isVal1Better = true;
                  else if (Number(val2) < Number(val1)) isVal2Better = true;
                } else if (typeof val1 === 'boolean' && typeof val2 === 'boolean') {
                    if (val1 === true && val2 === false) isVal1Better = true;
                    else if (val2 === true && val1 === false) isVal2Better = true;
                }
              }

              return (
                <Tr key={feature.key} _hover={{ bg: "gray.50", _dark:{bg:"gray.700"} }}>
                  <Td
                    fontWeight="medium" p={{base:3, md:4}} position="sticky" left={0}
                    bg={ (feature.key === "price" || feature.key === "area") ? "gray.50" : "inherit"}
                    zIndex={5}
                    borderRightWidth="1px"
                    borderColor="gray.200"
                    _dark={{ // Consolidated _dark props
                        bg: (feature.key === "price" || feature.key === "area") ? "gray.600" : "inherit",
                        borderColor:"gray.600"
                    }}
                  >
                      <Flex align="center">
                         {feature.icon && <Icon as={feature.icon} mr={2} color="gray.500" _dark={{color:"gray.400"}} boxSize="1em"/>}
                         <Text fontSize={{base:"xs", md:"sm"}} color="gray.800" _dark={{color:"gray.100"}} noOfLines={1}>{feature.label}</Text>
                      </Flex>
                  </Td>
                  <Td p={{base:3, md:4}} textAlign="center">
                    <Text
                      fontSize={{base:"xs", md:"sm"}}
                      fontWeight={isVal1Better ? "bold" : "normal"}
                      color={isVal1Better ? "green.600" : "gray.700"}
                      bg={isVal1Better ? "green.50" : "transparent"}
                      _dark={{ // Consolidated _dark props
                        color: isVal1Better ? "green.300" : "gray.300",
                        bg: isVal1Better ? "green.800" : "transparent"
                      }}
                      px={isVal1Better ? 2 : 0} py={isVal1Better ? 1 : 0} borderRadius="md" display="inline-block"
                      noOfLines={feature.noOfLines || 1}
                    >
                      {displayVal1}
                    </Text>
                  </Td>
                  <Td p={{base:3, md:4}} textAlign="center">
                    <Text
                      fontSize={{base:"xs", md:"sm"}}
                      fontWeight={isVal2Better ? "bold" : "normal"}
                      color={isVal2Better ? "green.600" : "gray.700"}
                      bg={isVal2Better ? "green.50" : "transparent"}
                      _dark={{ // Consolidated _dark props
                        color: isVal2Better ? "green.300" : "gray.300",
                        bg: isVal2Better ? "green.800" : "transparent"
                      }}
                      px={isVal2Better ? 2 : 0} py={isVal2Better ? 1 : 0} borderRadius="md" display="inline-block"
                      noOfLines={feature.noOfLines || 1}
                    >
                      {displayVal2}
                    </Text>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ComparePropertiesPage;