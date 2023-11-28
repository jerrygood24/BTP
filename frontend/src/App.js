import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import LoginPage from "./pages/Login";
import SignUp from "./pages/Signup";
import Repository from "./pages/Repository";
import { CssBaseline, Box } from "@mui/material";
import FileUpload from "./components/FileUpload";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherProfile from "./pages/Teacher/TeacherProfile";

const App = () => {
  const lessonsData = [
    {
      lessonTitle: "Lesson 1",
      chapters: ["Chapter 1.1", "Chapter 1.2", "Chapter 1.3"],
    },
    {
      lessonTitle: "Lesson 2",
      chapters: ["Chapter 2.1", "Chapter 2.2"],
    },
    {
      lessonTitle: "Lesson 3",
      chapters: ["Chapter 3.1", "Chapter 3.2", "Chapter 3.3", "Chapter 3.4"],
    },
  ];

  return (
    <Router>
      <Navbar />
      <Box sx={{ paddingTop: "64px" }}></Box>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/repository" element={<Repository />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/fileupload" element={<FileUpload />}></Route>

        <Route path="/teacherdashboard" element={<TeacherDashboard />}></Route>
        <Route path="/studentdashboard" element={<StudentDashboard />}></Route>
        <Route path = "/teacherprofile" element = {<TeacherProfile/>}></Route>
      </Routes>
    </Router>
  );
};

export default App;
