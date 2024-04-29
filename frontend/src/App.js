import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import LoginPage from './pages/Login';
import SignUp from './pages/Signup';
import Repository from './pages/Repository';
import { Box } from '@mui/material';
import FileUpload from './components/FileUpload';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
// import TeacherDetails from './pages/Teacher/TeacherDetails';
// import TeacherProfile from './pages/Teacher/TeacherProfile';
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(isLoggedIn === 'true');

    const isTeacher = localStorage.getItem('isTeacher');
    setIsTeacher(isTeacher === 'true');
  }, []);
  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} isTeacher={isTeacher} />
      <Box sx={{ paddingTop: '64px' }}></Box>
      <Routes>
        <Route exact path="/" element={<Home />} />
        {/* <Route path="/repository" element={<Repository />} /> */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        {!isLoggedIn && <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} setIsTeacher={setIsTeacher} />} />}
        
        <Route path="/signup" element={<SignUp />} />
        {/* <Route path="/fileupload" element={<FileUpload />} /> */}
        <Route path="/teacherdashboard" element={<TeacherDashboard />} />
        <Route path="/studentdashboard" element={<StudentDashboard />} />
        {/* <Route path="/teacherdashboard" element={<TeacherPro />} /> */}
      </Routes>
    </Router>
  );
};

export default App;