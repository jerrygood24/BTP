import React, { useState } from "react";
import { Card, CardContent, Typography, TextField } from "@mui/material";

const ImageSuggestion = ({ images }) => {
  const [searchKeyword, setSearchKeyword] = useState("");

  // Filter images based on partial match of scene ID
  const filteredImages = images.filter((image) =>
    image.id.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
  };
  const handleImageClick = (imageUrl) => {
    fetch(imageUrl, { headers: { "Content-Type": "image/jpeg" } })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "image.jpg");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => console.error("Error downloading image:", error));
  };
  return (
    <div className="image-suggestion-container">
      {/* Search input */}
      <TextField
        label="Search by Scene ID"
        variant="outlined"
        value={searchKeyword}
        onChange={handleSearchChange}
        fullWidth
        margin="normal"
      />

      {/* Display filtered images */}
      {searchKeyword !== "" && filteredImages.map((image, index) => (
        <Card key={index} className="image-suggestion-card">
          <img
            src={image.imagePath}
            alt={`Suggested Image ${index}`}
            style={{ width: "100%", cursor: "pointer" }}
            onClick={() => handleImageClick(image.imagePath)}
          />
          <CardContent>
            <Typography variant="body2" color="textSecondary">
              ID: {image.id}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Description: {image.description}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ImageSuggestion;
