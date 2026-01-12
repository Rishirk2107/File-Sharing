import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Input, Button, Text } from '@chakra-ui/react'; // Import Chakra UI components
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${process.env.REACT_APP_PORT_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => navigate('/'), 1200);
      } else {
        setError('Login failed! Please check your credentials.');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${process.env.REACT_APP_PORT_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, email, password })
      });
      if (res.ok) {
        setSuccess('Signup successful! Please log in.');
        setTimeout(() => setIsLogin(true), 1200);
      } else {
        setError('Signup failed! Please try again.');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <Box className="container d-flex align-items-center justify-content-center" minH="100vh" bgGradient="linear(to-br, blue.50, blue.100)">
      <Box
        className="shadow-lg p-5 bg-white rounded"
        maxW="400px"
        w="100%"
        borderRadius="xl"
        borderWidth="1px"
        boxShadow="lg"
        position="relative"
      >
        <Box mb={4}>
          {error && (
            <Text color="red.500" textAlign="center" fontWeight="bold" mb={2}>
              {error}
            </Text>
          )}
          {success && (
            <Text color="green.500" textAlign="center" fontWeight="bold" mb={2}>
              {success}
            </Text>
          )}
        </Box>
        {isLogin ? (
          <form onSubmit={handleLogin}>
            <Text as="h2" fontSize="2xl" mb={4} textAlign="center" fontWeight="bold" color="blue.700">
              Login
            </Text>
            <Input
              className="mb-3"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isRequired
              variant="outline"
              size="lg"
              focusBorderColor="blue.400"
            />
            <Input
              className="mb-3"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isRequired
              variant="outline"
              size="lg"
              focusBorderColor="blue.400"
            />
            <Button
              className="w-100 mb-3"
              type="submit"
              colorScheme="blue"
              size="lg"
              isLoading={loading}
              loadingText="Logging in..."
              borderRadius="md"
              boxShadow="md"
            >
              Login
            </Button>
            <Text
              as="p"
              textAlign="center"
              onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
              cursor="pointer"
              color="blue.500"
              _hover={{ textDecoration: 'underline', color: 'blue.700' }}
              mt={2}
            >
              Don't have an account? <b>Sign up here.</b>
            </Text>
          </form>
        ) : (
          <form onSubmit={handleSignup}>
            <Text as="h2" fontSize="2xl" mb={4} textAlign="center" fontWeight="bold" color="blue.700">
              Signup
            </Text>
            <Input
              className="mb-3"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              isRequired
              variant="outline"
              size="lg"
              focusBorderColor="blue.400"
            />
            <Input
              className="mb-3"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isRequired
              variant="outline"
              size="lg"
              focusBorderColor="blue.400"
            />
            <Input
              className="mb-3"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isRequired
              variant="outline"
              size="lg"
              focusBorderColor="blue.400"
            />
            <Button
              className="w-100 mb-3"
              type="submit"
              colorScheme="blue"
              size="lg"
              isLoading={loading}
              loadingText="Signing up..."
              borderRadius="md"
              boxShadow="md"
            >
              Signup
            </Button>
            <Text
              as="p"
              textAlign="center"
              onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
              cursor="pointer"
              color="blue.500"
              _hover={{ textDecoration: 'underline', color: 'blue.700' }}
              mt={2}
            >
              Already have an account? <b>Log in here.</b>
            </Text>
          </form>
        )}
      </Box>
    </Box>
  );
};

export default LoginSignup;
