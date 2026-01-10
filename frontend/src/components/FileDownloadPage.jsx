
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
    <Flex align="center" justify="center" minH="100vh" bg="gray.50">
      <Box p={8} bg="white" shadow="lg" borderRadius="md">
        {loading ? (
          <Flex justify="center" align="center" minH="200px"><Spinner size="xl" /></Flex>
        ) : fileInfo ? (
          <>
            <Heading as="h2" size="lg" mb={4} textAlign="center">
              {fileInfo.originalName || 'File'}
            </Heading>
            <Text textAlign="center" mb={6}>
              Click the button below to view or download the file from Cloudinary.
            </Text>
            <Flex justify="center">
              <Button colorScheme="blue" onClick={visitFile}>
                Open File
              </Button>
            </Flex>
            {fileInfo.url && (
              <Text mt={4} fontSize="sm" wordBreak="break-all" textAlign="center">
                <a href={fileInfo.url} target="_blank" rel="noopener noreferrer">{fileInfo.url}</a>
              </Text>
            )}
          </>
        ) : (
          <Text textAlign="center">File not found or you do not have access.</Text>
        )}
      </Box>
    </Flex>
  );
};

export default FileDownloadPage;
