import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  Link,
  VStack,
  HStack,
  useToast,
} from '@chakra-ui/react';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        navigate('/main');
      } else {
        toast({
          title: 'Login failed!',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Login Error:', error);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, email, password }),
      });
      if (res.ok) {
        toast({
          title: 'Signup successful, please log in!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setIsLogin(true);
      } else {
        toast({
          title: 'Signup failed!',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Signup Error:', error);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgGradient="linear(to-r, teal.500, green.500)"
    >
      <VStack
        as="form"
        onSubmit={isLogin ? handleLogin : handleSignup}
        spacing={4}
        bg="white"
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        maxWidth="400px"
        width="full"
      >
        <Heading as="h2" size="lg" color="teal.600">
          {isLogin ? 'Login' : 'Signup'}
        </Heading>
        
        {!isLogin && (
          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </FormControl>
        )}
        
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </FormControl>
        
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </FormControl>
        
        <Button
          type="submit"
          colorScheme="teal"
          size="md"
          width="full"
        >
          {isLogin ? 'Login' : 'Signup'}
        </Button>
        
        <HStack>
          <Text>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
          </Text>
          <Link color="teal.500" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign up here' : 'Log in here'}
          </Link>
        </HStack>
      </VStack>
    </Box>
  );
};

export default LoginSignup;
