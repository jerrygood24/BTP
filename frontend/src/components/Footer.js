import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Footer = () => {
  return (
    <Box
      bgcolor="primary.main"
      color="white"
      paddingY={2}
      textAlign="center"
      mt={3}
      ml={0}
      mr={0}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body1">
            <EmailIcon fontSize="small" /> info@example.com
          </Typography>
          <Typography variant="body1">
            <PhoneIcon fontSize="small" /> +1 (123) 456-7890
          </Typography>
          <Typography variant="body1">
            <LocationOnIcon fontSize="small" /> 123 Street Name, City
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" gutterBottom>
            Useful Links
          </Typography>
          <Typography variant="body1">Home</Typography>
          <Typography variant="body1">About Us</Typography>
          <Typography variant="body1">Services</Typography>
          <Typography variant="body1">Blog</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" gutterBottom>
            Social Media
          </Typography>
          <Typography variant="body1">Facebook</Typography>
          <Typography variant="body1">Twitter</Typography>
          <Typography variant="body1">Instagram</Typography>
          <Typography variant="body1">LinkedIn</Typography>
        </Grid>
      </Grid>
      <Box marginTop={2}>
        <Typography variant="body2">
          &copy; 2023 Your Company. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
