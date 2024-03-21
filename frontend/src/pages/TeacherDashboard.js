import { Box } from "@mui/material";
import React, { useEffect, useState } from 'react';
import LessonDetails from "./Teacher/LessonDetails";
import TeacherDetails from "./Teacher/TeacherDetails";
import React, { useEffect, useState } from 'react';
import axios from "axios";
import axios from "axios";
// import TeacherDashboard from "./Teacher/LessonDetails";

const TeacherDashboard = () => {
  const [lessonDetails, setLessonDetails] = useState([]);
  const [subject, setsubject] = useState("");
  const [title, settitle] = useState("");
  const [teacherId, setTeacherId] = useState(null);
  const accessToken = localStorage.getItem("access_token");
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
      else{
        setLessonDetails([]);
      }
    }, [teacherId]);

  const fetchLessonDetails = async () => {
    try {
      const lessonsResponse = await axios.get(`http://127.0.0.1:8000/accounts/lessons/?teacher=${teacherId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
      const lessonData = lessonsResponse.data;
      console.log(lessonData);
      const lessonsWithChapters = await Promise.all(lessonData.map(async (lesson) => {
        console.log("lesson:", lesson);
        const chaptersResponse = await axios.get(`http://127.0.0.1:8000/accounts/subchapters/?lesson=${lesson.id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        return { ...lesson, chapters: chaptersResponse.data };
      }));
      setLessonDetails(lessonsWithChapters);
      console.log("Lesson with Chapters:", lessonsWithChapters);
    } catch (error) {
      console.error("Error fetching lesson details:", error);
    }
  };

  const fetchLessonDetailsForSubject = async (subject, title) => {
    // Fetch lesson details for the subject and update the state
    // Example: You may call an API endpoint to fetch data
    // setLessonDetails(response.data);
    setsubject(subject);
    settitle(title);
    setLessonDetails([{
      lessonTitle: "Lesson 1",
      chapters: ["Chapter 1.1", "Chapter 1.2", "Chapter 1.3"],
      date: "2023-11-04",
      time: "09:00 AM",
      studentsSeen: ["Alice", "Bob", "Charlie"],
    },
    {
      lessonTitle: "Lesson 2",
      chapters: ["Chapter 2.1", "Chapter 2.2"],
      date: "2023-11-05",
      time: "10:30 AM",
      studentsSeen: ["David", "Emma"],
    },
    {
      lessonTitle: "Lesson 4",
      chapters: ["Chapter 4.1", "Chapter 4.2", "Chapter 4.3"],
      date: "2023-11-08",
      time: "09:45 AM",
      studentsSeen: ["Helen", "Isaac"],
    },
    {
      lessonTitle: "Lesson 5",
      chapters: ["Chapter 5.1", "Chapter 5.2"],
      date: "2023-11-09",
      time: "03:30 PM",
      studentsSeen: ["Jack", "Karen"],
    }])


  };
  return (
    <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
      <TeacherDetails onSubjectSelect={fetchLessonDetailsForSubject} />
      <LessonDetails lessonDetails={lessonDetails} setLesson={setLessonDetails} subject={subject} />

      {/* {teacherId && <TeacherDetails teacherId={teacherId} />} */}
      {teacherId && <TeacherDetails teacherId = {teacherId} onSubjectSelect={fetchLessonDetails} />}
      <LessonDetails lessonDetails={lessonDetails} setLessonDetails={setLessonDetails} subject={subject}/>
      
    </Box>

  );
}

export default TeacherDashboard;