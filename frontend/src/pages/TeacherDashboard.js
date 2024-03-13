import { Box } from "@mui/material";
import React, { useEffect, useState } from 'react';
import LessonDetails from "./Teacher/LessonDetails";
import TeacherDetails from "./Teacher/TeacherDetails";
import axios from "axios";
// import TeacherDashboard from "./Teacher/LessonDetails";

const TeacherDashboard = () => {
  const [lessonDetails, setLessonDetails] = useState([]);
  const [teacherId, setTeacherId] = useState(null);
    useEffect(() => {

      const storedTeacherId = localStorage.getItem("teacher_id");
      if (storedTeacherId) {
        setTeacherId(storedTeacherId);
      }
      console.log("Stored Teacher ID:", storedTeacherId);
    }, []);
    useEffect(() => {
      if (teacherId) {
        fetchLessonDetails();
      }
    }, [teacherId]);

  const fetchLessonDetails = async () => {
    try {
      const lessonsResponse = await axios.get(`http://127.0.0.1:8000/accounts/lessons/?teacher=${teacherId}`);
      const lessonData = lessonsResponse.data;
      console.log(lessonData);
      const lessonsWithChapters = await Promise.all(lessonData.map(async (lesson) => {
        console.log("lesson:", lesson);
        const chaptersResponse = await axios.get(`http://127.0.0.1:8000/accounts/subchapters/?lesson=${lesson.id}`);
        return { ...lesson, chapters: chaptersResponse.data };
      }));
      setLessonDetails(lessonsWithChapters);
      console.log("Lesson with Chapters:", lessonsWithChapters);
    } catch (error) {
      console.error("Error fetching lesson details:", error);
    }
  };


  return (
    <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
      {/* {teacherId && <TeacherDetails teacherId={teacherId} />} */}
      {teacherId && <TeacherDetails teacherId = {teacherId} onSubjectSelect={fetchLessonDetails} />}
      <LessonDetails lessonDetails={lessonDetails} setLessonDetails={setLessonDetails}/>
      
    </Box>
  
  );
}

export default TeacherDashboard;