
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Heading, Button, Flex, Text, useToast, Spinner } from '@chakra-ui/react';

const FileDownloadPage = () => {
  const { "*": uniqueName } = useParams();
  const [fileInfo, setFileInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchFileInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_PORT_URL}/api/files/list`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify({ preference: { type: 'size', value: 1 } }),
        });
        if (!response.ok) throw new Error('Failed to fetch file info');
        const files = await response.json();
        // Find the file by uniqueName (which may include slashes)
        const file = files.find(f => f.uniqueName === uniqueName);
        setFileInfo(file);
      } catch (error) {
        setFileInfo(null);
        toast({
          title: 'File not found',
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchFileInfo();
  }, [uniqueName, toast]);

  const visitFile = () => {
    if (fileInfo && fileInfo.url) {
      window.open(fileInfo.url, '_blank');
    } else {
      toast({
        title: 'File URL not found',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box minH="100vh" bgGradient="linear(to-br, blue.50, blue.100)">
      {/* Header Bar */}
      <Box bg="blue.600" py={4} px={8} boxShadow="md">
        <Heading as="h1" size="lg" color="white" textAlign="left" letterSpacing="wide">
          <span role="img" aria-label="file">📁</span> File Download
        </Heading>
      </Box>
      <Flex align="center" justify="center" minH="80vh">
        <Box p={8} bg="white" shadow="2xl" borderRadius="xl" minW="350px" maxW="500px" w="100%">
          {loading ? (
            <Flex justify="center" align="center" minH="200px">
              <Spinner size="xl" color="blue.500" thickness="4px" speed="0.8s" />
            </Flex>
          ) : fileInfo ? (
            <>
              <Heading as="h2" size="lg" mb={4} textAlign="center" color="blue.700" fontWeight="bold">
                {fileInfo.originalName || 'File'}
              </Heading>
              <Text textAlign="center" mb={6} color="gray.700">
                Click below to view or download your file from Cloudinary.
              </Text>
              <Flex justify="center" mb={4}>
                <Button colorScheme="blue" size="lg" borderRadius="md" boxShadow="md" onClick={visitFile}>
                  Open File
                </Button>
              </Flex>
              {fileInfo.url && (
                <Box mt={4} p={2} border="1px" borderRadius="md" borderColor="blue.200" bg="blue.50">
                  <Text fontSize="sm" wordBreak="break-all" textAlign="center" color="blue.700">
                    <b>Cloudinary URL:</b> <a href={fileInfo.url} target="_blank" rel="noopener noreferrer">{fileInfo.url}</a>
                  </Text>
                </Box>
              )}
            </>
          ) : (
            <Text textAlign="center" color="red.500" fontWeight="bold">File not found or you do not have access.</Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default FileDownloadPage;
