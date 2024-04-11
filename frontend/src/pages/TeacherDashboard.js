import { Box } from "@mui/material";
import React, { useEffect, useState } from 'react';
import LessonDetails from "./Teacher/LessonDetails";
import TeacherDetails from "./Teacher/TeacherDetails";
// import React, { useEffect, useState } from 'react';
import axios from "axios";
// import axios from "axios";
// import TeacherDashboard from "./Teacher/LessonDetails";

const TeacherDashboard = () => {
  const [lessons,setlessons]=useState();
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
    else {
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
      setlessons(lessonData);
      // console.log(lessons);
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
      console.log("Lesson with Chapters:", lessonData);
    } catch (error) {
      console.error("Error fetching lesson details:", error);
    }
  };

  return (
    <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
      {/* <TeacherDetails onSubjectSelect={fetchLessonDetailsForSubject} />
      <LessonDetails lessonDetails={lessonDetails} setLesson={setLessonDetails} subject={subject} /> */}

      {/* {teacherId && <TeacherDetails teacherId={teacherId} />} */}
      {teacherId && <TeacherDetails teacherId={teacherId} onSubjectSelect={fetchLessonDetails} />}
      <LessonDetails lessonDetails={lessonDetails} setLessonDetails={setLessonDetails} subject={subject} lessons={lessons} />

    </Box>

  );
}

export default TeacherDashboard;