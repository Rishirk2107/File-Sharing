import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Button,
  Input,
  Stack,
  Flex,
  Text,
  useToast,
  useClipboard,
} from '@chakra-ui/react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [shareFile, setShareFile] = useState(null);
  const toast = useToast();
  const { onCopy, hasCopied } = useClipboard(
    `${window.location.href}files/${shareFile}`
  );

  const token = localStorage.getItem('token');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_PORT_URL}/api/files/list`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify({ preference: { type: 'size', value: 1 } }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch files');
        }

        const data = await response.json();
        setFiles(data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${process.env.REACT_APP_PORT_URL}/api/files/upload`, {
        method: 'POST',
        body: formData,
        headers:{
          "Authorization": `Bearer ${token}`,
        }
        
      });

      if (!response.ok) {
        throw new Error('Error uploading file');
      }

      toast({
        title: 'File uploaded successfully!',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      window.location.reload();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Error uploading file',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const downloadFile = (uniqueName) => {
    // Find the file object by uniqueName
    const file = files.find(f => f.uniqueName === uniqueName);
    if (file && file.url) {
      // Open the Cloudinary URL directly
      window.open(file.url, '_blank');
    } else {
      toast({
        title: 'File URL not found',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleShare = (uniqueName) => {
    fetch(`${process.env.REACT_APP_PORT_URL}/api/files/share/${uniqueName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    setShareFile(uniqueName); // Sets the file to be shared
  };

  const handleVisit = (uniqueName) => {
    window.open(`${window.location.href}files/${uniqueName}`, '_blank'); // Opens in a new tab
  };

  return (
    <Box minH="100vh" bgGradient="linear(to-br, blue.50, blue.100)">
      {/* Header Bar */}
      <Box bg="blue.600" py={4} px={8} boxShadow="md">
        <Heading as="h1" size="lg" color="white" textAlign="left" letterSpacing="wide">
          <span role="img" aria-label="file">📁</span> File Sharing App
        </Heading>
      </Box>

      <Container>
        <Row className="justify-content-center mt-5">
          {files.length > 0 ? (
            files.map((file, index) => (
              <Col key={index} md={4} className="mb-4">
                <Flex
                  p={5}
                  bg="white"
                  shadow="lg"
                  borderRadius="xl"
                  direction="column"
                  align="center"
                  justify="center"
                  transition="box-shadow 0.2s"
                  _hover={{ boxShadow: '2xl', transform: 'scale(1.03)' }}
                >
                  <Text fontSize="xl" fontWeight="bold" color="blue.700" mb={2}>
                    {file.originalName}
                  </Text>
                  <Button
                    mt={2}
                    colorScheme="teal"
                    onClick={() => downloadFile(file.uniqueName)}
                    borderRadius="md"
                    boxShadow="md"
                  >
                    Download
                  </Button>
                  {file.url && (
                    <Box mt={2} p={2} border="1px" borderRadius="md" borderColor="gray.300" bg="gray.50">
                      <Text fontSize="sm" wordBreak="break-all" color="gray.700">
                        <b>Cloudinary URL:</b> <a href={file.url} target="_blank" rel="noopener noreferrer">{file.url}</a>
                      </Text>
                    </Box>
                  )}
                  <Button
                    mt={2}
                    colorScheme="blue"
                    onClick={() => handleShare(file.uniqueName)}
                    borderRadius="md"
                    boxShadow="md"
                  >
                    Share
                  </Button>
                  {shareFile === file.uniqueName && (
                    <Box mt={2} p={2} border="1px" borderRadius="md" borderColor="blue.200" bg="blue.50">
                      <Text fontSize="sm" color="blue.700">
                        <b>Share URL:</b> {window.location.href}/files/{file.uniqueName}
                      </Text>
                      <Stack direction="row" spacing={2} mt={2}>
                        <Button size="sm" colorScheme="blue" variant="outline" onClick={onCopy}>
                          {hasCopied ? 'Copied!' : 'Copy'}
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="green"
                          onClick={() => handleVisit(file.uniqueName)}
                        >
                          Visit
                        </Button>
                      </Stack>
                    </Box>
                  )}
                </Flex>
              </Col>
            ))
          ) : (
            <Text fontSize="lg" color="gray.600" mt={8} textAlign="center">No files available.</Text>
          )}
        </Row>
      </Container>

      {/* Upload Floating Bar */}
      <Box position="fixed" bottom="30px" right="30px" zIndex={10}>
        <Stack direction="row" spacing={4} align="center" bg="white" p={3} borderRadius="xl" boxShadow="lg">
          <Input
            type="file"
            onChange={handleFileChange}
            variant="outline"
            size="md"
            borderColor="blue.300"
            _hover={{ borderColor: 'blue.500' }}
          />
          <Button colorScheme="blue" onClick={handleFileUpload} borderRadius="md" boxShadow="md">
            Upload File
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default MainPage;
