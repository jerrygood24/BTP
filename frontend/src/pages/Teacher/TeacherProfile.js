import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import LessonDetails from "./LessonDetails";
import TeacherDetails from "./TeacherDetails";

const TeacherProfile = () => {
    const [teacherId, setTeacherId] = useState(null);
  
    useEffect(() => {
      // Retrieve teacher id from localStorage
      const storedTeacherId = localStorage.getItem("teacher_id");
      console.log("Stored Teacher ID:", storedTeacherId);
      if (storedTeacherId) {
        setTeacherId(parseInt(storedTeacherId));
      }
    }, []);

  return (
    <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
      {teacherId && <TeacherDetails teacherId={teacherId} />}
      <LessonDetails />
    </Box>
  );
};

export default TeacherProfile;
