import React from 'react';
import ImageSlider from './ImageSlider';
import { Box, Typography } from '@mui/material';
import Footer from './Footer';

const slides1 = [
  { url: "img/img3.jpg", title: "img3" },
  { url: "img/img2.jpg", title: "img2" },
  { url: "img/img1.jpg", title: "img1" },
  

  { url: "img/img4.jpg", title: "img4" },
 
];

const slides2 = [
  
  { url: "img/img4.jpg", title: "img4" },
  { url: "img/img3.jpg", title: "img3" },
  { url: "img/img2.jpg", title: "img2" },
  { url: "img/img1.jpg", title: "img1" },
];
  

 

const Home = () => {
  const containerStyles = {
    width: "60vw",
    height: "60vh",
    margin: "0 auto",
    marginTop:"30px",
    marginBottom:"30px",
  
    
  };

  return (
  <Box
   
  >
 

    <Typography
    sx = {{fontFamily:"monospace", textAlign:"center",mt:2,fontSize:40,fontWeight:10}}
    >3D VR EDUCATOR</Typography>
    
    <div style={containerStyles }>
        <ImageSlider slides={slides1} />
    </div>
    <hr />
    <Typography
    sx = {{fontFamily:"monospace", textAlign:"center",mt:2,fontSize:40,fontWeight:10}}
    >Create and Track Lessons</Typography>
    <div style={containerStyles}>
        <ImageSlider slides={slides2} />
    </div>

    <hr />
    <Typography
    sx = {{fontFamily:"monospace", textAlign:"center",mt:2,fontSize:40,fontWeight:10}}
    >Learn with interactive 3d lessons</Typography>
    <div style={containerStyles}>
        <ImageSlider slides={slides1} />
    </div>
    <Footer/>

  </Box>
  );

};

export default Home;