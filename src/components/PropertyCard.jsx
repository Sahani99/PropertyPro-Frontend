// src/components/PropertyCard.jsx
import React from 'react';
import { Box, Heading, Text, Image, Button, Badge, Stack, Icon , Flex } from '@chakra-ui/react';
import { FaBed, FaBath, FaRulerCombined } from 'react-icons/fa'; // Example icons

const PropertyCard = ({ property }) => {
  if (!property) {
    return null; // Or some placeholder if property is undefined
  }

  return (
    <Box  borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg="white" // Explicitly set background to white
      boxShadow="md" // Initial shadow
      transition="all 0.2s ease-in-out" // For smooth transition
      _hover={{
        transform: 'translateY(-4px)', // Lifts the card up slightly
        boxShadow: 'xl',             // Increases the shadow
        //borderColor: 'teal.400',  // Optional: change border color
        cursor: 'pointer',       // Optional: change cursor
        }}
         >
      {property.imageUrls && property.imageUrls[0] ? (
        <Image
          src={property.imageUrls[0]}
          alt={`View of ${property.title}`}
          height="200px"
          width="100%"
          objectFit="cover"
        />
      ) : (
        <Box height="200px" width="100%" bg="gray.200" display="flex" alignItems="center" justifyContent="center">
          <Text color="gray.500">No Image Available</Text>
        </Box>
      )}

      <Box p={5}>
        <Stack direction="row" alignItems="baseline" mb={1}>
          <Badge borderRadius="full" px="2" colorScheme="teal">
            {property.propertyType ? property.propertyType.toUpperCase() : 'N/A'}
          </Badge>
          {property.status && (
            <Badge borderRadius="full" px="2" colorScheme={property.status === 'for sale' ? 'green' : 'orange'}>
              {property.status}
            </Badge>
          )}
        </Stack>

        <Heading as="h3" size="md" fontWeight="semibold" noOfLines={2} mb={2} minHeight="3em">
          {property.title || 'Untitled Property'}
        </Heading>

        <Text fontSize="sm" color="gray.600" noOfLines={3} mb={3} minHeight="4.5em">
          {property.description || 'No description available.'}
        </Text>

        <Text fontWeight="bold" fontSize="xl" color="teal.600" mb={3}>
          ${property.price ? property.price.toLocaleString() : 'Price not specified'}
        </Text>

        <Stack direction="row" spacing={4} color="gray.600" fontSize="sm" mb={3}>
          {property.bedrooms !== undefined && (
            <Flex alignItems="center">
              <Icon as={FaBed} mr={1} /> <Text>{property.bedrooms} Beds</Text>
            </Flex>
          )}
          {/* You can add bathrooms if you add it to your model */}
          {/* <Flex alignItems="center">
            <Icon as={FaBath} mr={1} /> <Text>{property.bathrooms} Baths</Text>
          </Flex> */}
          {property.area !== undefined && (
            <Flex alignItems="center">
              <Icon as={FaRulerCombined} mr={1} /> <Text>{property.area} sq m</Text>
            </Flex>
          )}
        </Stack>

        <Text fontSize="xs" color="gray.500" mt={2}>
          Added: {property.dateAdded ? new Date(property.dateAdded).toLocaleDateString() : 'N/A'}
        </Text>

        <Button mt={4} colorScheme="teal" width="full">
          View Details
        </Button>
      </Box>
    </Box>
  );
};

export default PropertyCard;