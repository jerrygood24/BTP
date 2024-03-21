import { Box } from "@mui/material";
import LessonDetails from "./Teacher/LessonDetails";
import TeacherDetails from "./Teacher/TeacherDetails";
import React, { useEffect, useState } from 'react';
import axios from "axios";
// import TeacherDashboard from "./Teacher/LessonDetails";

const TeacherDashboard = () => {
  const [lessonDetails, setLessonDetails] = useState([]);
  const [subject,setsubject]=useState("");
  const [title,settitle]=useState("");

  useEffect(() => {
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
    },
    {
      lessonTitle: "Lesson 6",
      chapters: ["Chapter 6.1", "Chapter 6.2", "Chapter 6.3"],
      date: "2023-11-11",
      time: "11:20 AM",
      studentsSeen: ["Liam", "Mia"],
    },
    {
      lessonTitle: "Lesson 7",
      chapters: ["Chapter 7.1", "Chapter 7.2", "Chapter 7.3", "Chapter 7.4"],
      date: "2023-11-12",
      time: "01:45 PM",
      studentsSeen: ["Nora", "Oliver"],
    },
    {
      lessonTitle: "Lesson 8",
      chapters: ["Chapter 8.1", "Chapter 8.2"],
      date: "2023-11-14",
      time: "10:00 AM",
      studentsSeen: ["Penny", "Quincy"],
    }])
  }, [])

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

    </Box>

  );
}

export default TeacherDashboard;