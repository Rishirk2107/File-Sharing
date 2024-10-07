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

const MainPage = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [shareFile, setShareFile] = useState(null);
  const toast = useToast();
  const { onCopy, hasCopied } = useClipboard(
    `http://localhost:3000/files/${shareFile}`
  );

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/files/list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
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
      const response = await fetch('http://localhost:3001/api/files/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
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

  const downloadFile = async (uniqueName) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/files/download/${uniqueName}`,
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
      link.setAttribute('download', uniqueName); // Uses uniqueName for downloading
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

  const handleShare = (uniqueName) => {
    setShareFile(uniqueName); // Sets the file to be shared
  };

  const handleVisit = (uniqueName) => {
    window.open(`http://localhost:3000/files/${uniqueName}`, '_blank'); // Opens in a new tab
  };

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      <Heading as="h1" size="xl" mb={8} textAlign="center">
        File Sharing App
      </Heading>

      <Container>
        <Row className="justify-content-center">
          {files.length > 0 ? (
            files.map((file, index) => (
              <Col key={index} md={4} className="mb-4">
                <Flex
                  p={4}
                  bg="white"
                  shadow="md"
                  borderRadius="md"
                  direction="column"
                  align="center"
                  justify="center"
                >
                  <Text fontSize="lg" fontWeight="bold">
                    {file.originalName} {/* Displays the original name */}
                  </Text>

                  <Button
                    mt={4}
                    colorScheme="teal"
                    onClick={() => downloadFile(file.uniqueName)} // Uses uniqueName for download
                  >
                    Download
                  </Button>

                  {/* Share Button */}
                  <Button
                    mt={2}
                    colorScheme="blue"
                    onClick={() => handleShare(file.uniqueName)}
                  >
                    Share
                  </Button>

                  {/* Display the shareable link */}
                  {shareFile === file.uniqueName && (
                    <Box mt={2} p={2} border="1px" borderRadius="md" borderColor="gray.300" bg="gray.100">
                      <Text fontSize="sm">
                        http://localhost:3000/files/{file.uniqueName} {/* Share URL */}
                      </Text>

                      <Stack direction="row" spacing={2} mt={2}>
                        <Button size="sm" onClick={onCopy}>
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
            <Text>No files available.</Text>
          )}
        </Row>
      </Container>

      <Box position="fixed" bottom="20px" right="20px">
        <Stack direction="row" spacing={4}>
          <Input
            type="file"
            onChange={handleFileChange}
            variant="outline"
            size="md"
          />
          <Button colorScheme="blue" onClick={handleFileUpload}>
            Upload File
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default MainPage;
