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
            style={{ width: "100%" }}
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
