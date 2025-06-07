import { Box, Heading } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

const PropertyDetailsPage = () => {
  const { propertyId } = useParams();

  return (
    <Box p={8}>
      <Heading>Property Details - {propertyId}</Heading>
      {/* Show property detail data */}
    </Box>
  );
};

export default PropertyDetailsPage;
