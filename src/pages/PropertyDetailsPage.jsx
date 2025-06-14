// src/pages/PropertyDetailsPage.jsx

import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Select,
  useToast,
  Tag as ChakraTag,
  TagLabel,
  TagCloseButton,
} from '@chakra-ui/react';
import { DayPicker } from 'react-day-picker';
import '../styles/day-picker.css'; 

import { useParams, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Image,
  VStack,
  HStack,
  Button,
  Icon,
  Divider,
  AspectRatio,
  Spinner,
  Alert,
  AlertIcon,
  Link,
  Grid,
} from '@chakra-ui/react';
import { FaBed, FaBath, FaRulerCombined, FaWarehouse, FaMapMarkerAlt, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

const PropertyDetailsPage = () => {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mainImage, setMainImage] = useState('');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await axios.get(`/properties/${propertyId}`);
        setProperty(data); 
        if (data.imageUrls && data.imageUrls.length > 0) {
          setMainImage(data.imageUrls[0]);
        }
      } catch (err) {
        console.error("API Error:", err.response ? err.response.data : err.message);
        setError('Could not load property details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    if (propertyId) { fetchProperty(); }
  }, [propertyId]);

  const handleRemoveDate = (dateToRemove) => {
    setSelectedDates((currentDates) =>
      currentDates.filter((date) => date.getTime() !== dateToRemove.getTime())
    );
  };

  const handleVisitRequestSubmit = async () => {
    if (selectedDates.length === 0) {
      toast({ title: 'No date selected', description: 'Please select at least one preferred date.', status: 'warning', duration: 4000, isClosable: true });
      return;
    }
    if (!selectedTime) {
      toast({ title: 'No time selected', description: 'Please select a preferred time for your visit.', status: 'warning', duration: 4000, isClosable: true });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        propertyId: property._id,
        propertyName: property.title,
        dates: selectedDates.map(date => date.toISOString().split('T')[0]),
        time: selectedTime,
      };
      await axios.post('/visits', payload);
      toast({ title: 'Request Sent!', description: "We've received your visit request. We will contact you shortly to confirm.", status: 'success', duration: 5000, isClosable: true, });
      onClose();
      setSelectedDates([]);
      setSelectedTime('');
    } catch (err) {
      console.error("Failed to submit visit request:", err);
      toast({ title: 'Submission Failed', description: 'Something went wrong. Please try again.', status: 'error', duration: 5000, isClosable: true, });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) { return ( <Flex justify="center" align="center" height="80vh"><Spinner size="xl" thickness="4px" color="teal.500" /></Flex> ); }
  if (error) { return ( <Container maxW="container.md" py={10}><Alert status="error" borderRadius="md"><AlertIcon />{error}</Alert><Link as={RouterLink} to="/properties" mt={4} color="teal.500" fontWeight="bold">← Go back to all properties</Link></Container> ); }
  if (!property) { return null; }

  return (
    <>
      <Container maxW="container.xl" py={{ base: 6, md: 10 }}>
        <Link as={RouterLink} to="/properties" mb={6} display="inline-flex" alignItems="center" fontWeight="medium">
            <Icon as={FaArrowLeft} mr={2} />
            Back to Listings
        </Link>
        <Grid templateColumns={{ base: '1fr', lg: '2.5fr 1.5fr' }} gap={{ base: 6, lg: 10 }}>
            <VStack spacing={8} align="stretch">
                 <Box>
                    <AspectRatio ratio={16 / 10} mb={4}>
                        <Image src={mainImage} alt={property.title} borderRadius="xl" objectFit="cover" boxShadow="lg" fallbackSrc='https://via.placeholder.com/800x500?text=No+Image' />
                    </AspectRatio>
                    <HStack spacing={3} overflowX="auto" pb={2}>
                    {property.imageUrls && property.imageUrls.map((img, index) => ( <Image key={index} src={img} boxSize={{ base: "80px", md: "100px"}} objectFit="cover" borderRadius="md" cursor="pointer" onClick={() => setMainImage(img)} border="3px solid" borderColor={mainImage === img ? 'teal.400' : 'transparent'} _hover={{ opacity: 0.8, transform: 'scale(1.05)' }} transition="all 0.2s" /> ))}
                    </HStack>
                </Box>
                <VStack spacing={3} align="stretch" bg="gray.50" p={6} borderRadius="lg">
                    <HStack>
                        <ChakraTag size="md" variant="subtle" colorScheme="teal">{property.propertyType?.toUpperCase() || 'N/A'}</ChakraTag>
                        <ChakraTag size="md" variant="subtle" colorScheme={property.status === 'for sale' ? 'green' : 'orange'}>{property.status?.toUpperCase() || 'AVAILABLE'}</ChakraTag>
                    </HStack>
                    <Heading as="h1" size="xl" letterSpacing="tight">{property.title}</Heading>
                    <Text color="gray.600" fontSize="lg"><Icon as={FaMapMarkerAlt} mr={2} />{property.location || 'Location not specified'}</Text>
                    <Heading as="h2" size="2xl" color="teal.600" pt={3}>${property.price ? property.price.toLocaleString() : 'N/A'}</Heading>
                </VStack>
                <Divider />
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={5} textAlign="center">
                    <Box><Icon as={FaBed} w={7} h={7} color="teal.500" mb={1} /><Text fontWeight="bold">{property.bedrooms || 0} Beds</Text></Box>
                    <Box><Icon as={FaBath} w={7} h={7} color="teal.500" mb={1} /><Text fontWeight="bold">{property.bathrooms || 0} Baths</Text></Box>
                    <Box><Icon as={FaRulerCombined} w={7} h={7} color="teal.500" mb={1} /><Text fontWeight="bold">{property.area || 0} sq m</Text></Box>
                    <Box><Icon as={FaWarehouse} w={7} h={7} color="teal.500" mb={1} /><Text fontWeight="bold">{property.garage || 0} Garage</Text></Box>
                </SimpleGrid>
                <VStack spacing={8} align="stretch">
                    <Box>
                        <Heading as="h2" size="lg" mb={3}>Description</Heading>
                        <Text color="gray.700" lineHeight="taller">{property.description}</Text>
                    </Box>
                    {property.amenities && property.amenities.length > 0 && (
                        <Box>
                            <Heading as="h2" size="lg" mb={4}>Amenities</Heading>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacingY={3} spacingX={5}>
                                {property.amenities.map(item => ( <HStack key={item}><Icon as={FaCheckCircle} color="green.500" /><Text>{item}</Text></HStack>))}
                            </SimpleGrid>
                        </Box>
                    )}
                </VStack>
            </VStack>
            <Box position="sticky" top="100px" alignSelf="start">
                <VStack spacing={5} p={6} bg="white" borderWidth="1px" borderColor="gray.200" borderRadius="xl" boxShadow="xl" align="stretch">
                    <Button colorScheme="teal" size="lg" w="100%" py={7} fontSize="lg" _hover={{ bg: 'teal.500', transform: 'translateY(-2px)' }} boxShadow="md" transition="all 0.2s" onClick={onOpen}>Request a Visit</Button>
                </VStack>
            </Box>
        </Grid>
      </Container>
      
      {/* =================================================================== */}
      {/* MODIFIED MODAL COMPONENT                                            */}
      {/* =================================================================== */}
      {/* FROM: size="lg" */}
      {/* TO:   size="2xl" to make the modal wider */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl">
        <ModalOverlay bg="blackAlpha.600" />
        <ModalContent borderRadius="xl">
          <ModalHeader fontWeight="600">Request a Visit for "{property?.title}"</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={6}>
              <FormControl isRequired>
                <FormLabel fontWeight="medium">1. Select one or more preferred dates</FormLabel>
                <Flex justifyContent="center">
                  <DayPicker mode="multiple" min={1} selected={selectedDates} onSelect={setSelectedDates} disabled={{ before: new Date() }} />
                </Flex>
              </FormControl>
              {selectedDates.length > 0 && (
                <Box w="100%" p={3} bg="gray.50" borderRadius="md">
                  <Text fontSize="sm" fontWeight="medium" mb={2}>Selected Dates:</Text>
                  <HStack wrap="wrap" spacing={2}>
                    {selectedDates.map((date) => (
                      <ChakraTag key={date.toString()} size="md" variant="solid" colorScheme="teal" borderRadius="full">
                        <TagLabel>{date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</TagLabel>
                        <TagCloseButton onClick={() => handleRemoveDate(date)} />
                      </ChakraTag>
                    ))}
                  </HStack>
                </Box>
              )}
              <FormControl isRequired>
                <FormLabel fontWeight="medium">2. Select a preferred time</FormLabel>
                <Select placeholder="Choose a time slot" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
                  <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                  <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                  <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                  <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
            <Button colorScheme="teal" isLoading={isSubmitting} onClick={handleVisitRequestSubmit}>Submit Request</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PropertyDetailsPage;