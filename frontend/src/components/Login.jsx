import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Input, Button, Text } from '@chakra-ui/react'; // Import Chakra UI components
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const navigate = useNavigate(); // For navigating to the /main page after login

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch( `${process.env.PATH_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important for cookies/sessions
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        navigate('/main'); // Redirect to /main after successful login
      } else {
        alert('Login failed!');
      }
    } catch (error) {
      console.error('Login Error:', error);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.PATH_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important for cookies/sessions
        body: JSON.stringify({ username, email, password })
      });
      if (res.ok) {
        alert('Signup successful, please log in!');
        setIsLogin(true); // Switch to login after successful signup
      } else {
        alert('Signup failed!');
      }
    } catch (error) {
      console.error('Signup Error:', error);
    }
  };

  return (
    <Box className="container d-flex align-items-center justify-content-center" minH="100vh">
      <Box
        className="shadow-lg p-5 bg-white rounded"
        maxW="400px"
        w="100%"
        borderRadius="md"
        borderWidth="1px"
      >
        {isLogin ? (
          <form onSubmit={handleLogin}>
            <Text as="h2" fontSize="2xl" mb={4} textAlign="center">
              Login
            </Text>
            <Input
              className="mb-3"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isRequired
              variant="filled"
            />
            <Input
              className="mb-3"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isRequired
              variant="filled"
            />
            <Button className="btn btn-primary w-100 mb-3" type="submit">
              Login
            </Button>
            <Text
              as="p"
              textAlign="center"
              onClick={() => setIsLogin(false)}
              cursor="pointer"
              color="blue.500"
              _hover={{ textDecoration: 'underline' }}
            >
              Don't have an account? Sign up here.
            </Text>
          </form>
        ) : (
          <form onSubmit={handleSignup}>
            <Text as="h2" fontSize="2xl" mb={4} textAlign="center">
              Signup
            </Text>
            <Input
              className="mb-3"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              isRequired
              variant="filled"
            />
            <Input
              className="mb-3"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isRequired
              variant="filled"
            />
            <Input
              className="mb-3"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isRequired
              variant="filled"
            />
            <Button className="btn btn-primary w-100 mb-3" type="submit">
              Signup
            </Button>
            <Text
              as="p"
              textAlign="center"
              onClick={() => setIsLogin(true)}
              cursor="pointer"
              color="blue.500"
              _hover={{ textDecoration: 'underline' }}
            >
              Already have an account? Log in here.
            </Text>
          </form>
        )}
      </Box>
    </Box>
  );
};

export default LoginSignup;
