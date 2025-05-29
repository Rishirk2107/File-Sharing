import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Heading, Button, Flex, Text, useToast } from '@chakra-ui/react';

const FileDownloadPage = () => {
  const { uniqueName } = useParams();
  const [fileInfo, setFileInfo] = useState(null);
  const toast = useToast();

  useEffect(() => {
    setFileInfo({ originalName: uniqueName });
  }, [uniqueName]);

  const downloadFile = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_PORT_URL}/api/files/download/${uniqueName}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error('Error downloading file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', uniqueName); // Set file name for download
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: 'Error downloading file',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex align="center" justify="center" minH="100vh" bg="gray.50">
      <Box p={8} bg="white" shadow="lg" borderRadius="md">
        <Heading as="h2" size="lg" mb={4} textAlign="center">
          {fileInfo?.originalName || 'File'} 
        </Heading>
        <Text textAlign="center" mb={6}>
          Click the button below to download the file.
        </Text>
        <Flex justify="center">
          <Button colorScheme="blue" onClick={downloadFile}>
            Download
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default FileDownloadPage;
