import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Link as ChakraLink,
  Stack,
  Text,
  useToast,
  IconButton, // Import IconButton
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Assuming your AuthContext is here
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'; // For password visibility
import { FcGoogle } from 'react-icons/fc';
import { FaApple, FaFacebook, FaTwitter } from 'react-icons/fa';

// Replace with your actual logo path
import logoSrc from '/Propertypro.png'; // If logo is in public folder
// import logoSrc from '../assets/propertypro-logo.png'; // If logo is in src/assets

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(''); // For displaying login errors

  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      toast({
        title: 'Input Error',
        description: 'Please enter both email and password.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const result = await login({ email, password });
    if (result.success) {
      toast({
        title: 'Login Successful',
        description: "Welcome back!",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/dashboard'); // Or your desired protected route
    } else {
      setError(result.message || 'Failed to login. Please check your credentials.');
      toast({
        title: 'Login Failed',
        description: result.message || 'Please check your credentials.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handlePasswordVisibility = () => setShowPassword(!showPassword);

  // Placeholder for social login
  const handleSocialLogin = (provider) => {
    toast({
      title: `${provider} login clicked`,
      description: "Social login functionality not yet implemented.",
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };


  return (
    <Flex
       width="99vw"    // Ensure backdrop is full viewport width
      minHeight="100vh"
      align="center"
      justify="center"
      bg={{ base: 'gray.50', md: 'gray.100' }} // Different bg for mobile vs desktop backdrop
    >
      <Flex
        direction={{ base: 'column', md: 'row' }}
        width="full"
        maxW={{ base: 'xl', md: '4xl', lg: '6xl' }} // Responsive max width
        mx="full"
        bg="white"
        boxShadow={{ base: 'none', md: '2xl' }}
        rounded={{ base: 'none', md: 'xl' }}
          borderTopEndRadius={{ md: 'xl' }}     // Chakra prop for top-right on md+
          borderBottomEndRadius={{ md: 'xl' }}  // Chakra prop for bottom-right on md+
        overflow="hidden" // Important for rounded corners on image
      >
        {/* Left Side - Form */}
        <Box
          w={{ base: 'full', md: '50%', lg: '75%' }} // Adjust width percentage
          display={{ base: 'none', md: 'block' }} // Hide on mobile, show on md and up
          position="relative" // For potential overlay or absolute positioned elements if needed
        >
          <Image
            src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmlsbGElMjBleHRlcmlvcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" // Replace with your image URL
            alt="Luxury property"
            objectFit="cover"
            width="100%"
            height="100%" // Make image take full height of its container
          />
        </Box>

        {/* Right Side - Image */}



                <Box
          w={{ base: 'full', md: '50%', lg: '95%' }} // Adjust width percentage as needed
          p={{ base: 6, sm: 8, md: 12 }}
          

        >
          <Stack spacing={6}>
            <Image src={logoSrc} alt="PropertyPro Logo" boxSize="100px" mb={2} />
            <Heading as="h1" size="lg" fontWeight="bold">
              Welcome to PropertyPro 👋
            </Heading>

            <form onSubmit={handleSubmit}>
              <Stack spacing={5}>
                <FormControl id="email">
                  <FormLabel>Email Address</FormLabel>
                  <Input
                    type="email"
                    placeholder="sahani.randula@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    borderColor="gray.300"
                    _hover={{ borderColor: 'gray.400' }}
                    size="lg"
                  />
                </FormControl>

                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <InputGroup size="lg">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="************"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      borderColor="gray.300"
                      _hover={{ borderColor: 'gray.400' }}
                    />
                    <InputRightElement>
                      <IconButton
                        variant="ghost"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={handlePasswordVisibility}
                        _hover={{ bg: 'transparent' }}
                        _active={{ bg: 'transparent' }}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                {error && (
                  <Text color="red.500" fontSize="sm">{error}</Text>
                )}

                <Button
                  type="submit"
                  // colorScheme="green" // Using Chakra's green
                  bg="#00B87B" // Exact green from your design
                  color="white"
                  _hover={{ bg: '#00A06B' }}
                  size="lg"
                  fontSize="md"
                  width="full"
                  isLoading={loading}
                  mt={2} // Add some margin top
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </Stack>
            </form>

            <Text textAlign="center" fontSize="sm">
              Don't you have an account?{' '}
              <ChakraLink as={RouterLink} to="/register" color="brand.green" fontWeight="semibold">
                Sign-Up
              </ChakraLink>
            </Text>

            <Flex align="center" color="gray.500">
              <Divider flex="1" />
              <Text px="3" fontSize="sm" fontWeight="medium">Or</Text>
              <Divider flex="1" />
            </Flex>

            <HStack spacing={3} justify="center">
              <IconButton
                aria-label="Login with Google"
                icon={<FcGoogle size="24px" />}
                variant="outline"
                isRound
                size="lg"
                onClick={() => handleSocialLogin('Google')}
              />
              <IconButton
                aria-label="Login with Apple"
                icon={<FaApple size="24px" />}
                variant="outline"
                isRound
                size="lg"
                color="black" // Apple icon is usually black or gray
                onClick={() => handleSocialLogin('Apple')}
              />
              <IconButton
                aria-label="Login with Facebook"
                icon={<FaFacebook size="24px" />}
                variant="outline"
                isRound
                size="lg"
                color="#1877F2" // Facebook blue
                onClick={() => handleSocialLogin('Facebook')}
              />
              <IconButton
                aria-label="Login with Twitter"
                icon={<FaTwitter size="24px" />}
                variant="outline"
                isRound
                size="lg"
                color="#1DA1F2" // Twitter blue
                onClick={() => handleSocialLogin('Twitter')}
              />
            </HStack>
          </Stack>
        </Box>
      </Flex>
    </Flex>
  );
}

export default LoginPage;