import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Box from '@mui/material/Box';


function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setSelectedFile(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = () => {
    if (selectedFile) {
      // You can handle the file upload logic here, e.g., send the file to the server.
      console.log('Selected File:', selectedFile);

    
    }
  };

  return (
    <div
      style={{
        width: '300px',
        height: '250px',
        margin: '10px auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px dotted #aaa',
        borderRadius: '8px',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
      }}
    >
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          cursor: 'pointer',
        }}
      >
        <input
          type="file"
          style={{ display: 'none' }}
          id="fileInput"
          onChange={handleFileChange}
        />
        <label htmlFor="fileInput">
          <Box
            component="div"
            border={1}
            borderColor="grey.400"
            borderRadius={3}
            p={4}
            textAlign="center"
            bgcolor="primary.main" // You can choose a background color
          >
            <CloudUploadIcon fontSize="large" />
            <div>Upload a File</div>
          </Box>
        </label>
        {selectedFile && <div>Selected File: {selectedFile.name}</div>}
      </div>
      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!selectedFile}
        >
          Submit
        </Button>
      </Box>
      {/* <FileUpload2/> */}
    </div>
  );
}

export default FileUpload;


