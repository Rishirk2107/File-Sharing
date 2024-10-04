import React, { useState, useEffect } from 'react';

const MainPage = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/files/list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Allows cookies to be included
          body: JSON.stringify({ preference:{type:"size",value:1}}),
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
        credentials: 'include', // Allows cookies to be included
      });

      if (!response.ok) {
        throw new Error('Error uploading file');
      }

      alert('File uploaded successfully!');
      window.location.reload(); // Reload page to update the file list
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const downloadFile = async (uniqueName) => {
    try {
      const response = await fetch(`http://localhost:3000/api/files/download/${uniqueName}`, {
        method: 'GET',
        credentials: 'include', // Allows cookies to be included
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error downloading file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', uniqueName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link); // Clean up after download
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <div>
      <h1>File Sharing App</h1>
      <div>
        {files.map((file, index) => (
          <div key={index}>
            <span>{file.uniqueName}</span>
            <button onClick={() => downloadFile(file.uniqueName)}>Download</button>
          </div>
        ))}
      </div>
      <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleFileUpload}>Upload File</button>
      </div>
    </div>
  );
};

export default MainPage;
