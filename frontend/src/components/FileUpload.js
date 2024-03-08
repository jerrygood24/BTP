import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Box from '@mui/material/Box';
import axios from 'axios';
import axiosInstance from '../utils/api';


function FileUpload({ setImageUrl }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [name,setName] = useState("")
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setName(e.target.files[0].name);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setSelectedFile(droppedFile);
    setName(droppedFile.name);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('name', name);
      const token = localStorage.getItem('access_token');
      console.log(token); 
        axios.post('http://127.0.0.1:8000/accounts/imageQuery/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log('File uploaded successfully:', response.data);
          if (typeof setImageUrl === 'function') {
            setImageUrl(response.data.image);
          } else {
            console.error('setImageUrl is not a function');
            updateImageUrlDirectly(response.data.image)
          }

        })
        .catch((error) => {
          console.error('Error uploading file:', error);
        });
 
    
    }
    const updateImageUrlDirectly = (newImageUrl) => {
      console.log('Updated imageUrl directly in Repository:', newImageUrl);
  };
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
      {/* <input
        type="text"
        placeholder="Enter a name"
        value={name}
        onChange={handleNameChange}
      /> */}
      {/* {selectedFile && <div>Selected File: {selectedFile.name}</div>} */}
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


