import React, { useState, useEffect } from "react";
import "../css/Repository.css";
import Quizstudents from './Quiz_student';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import axios from "axios";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Pano from "../components/Pano";
import AddBoxIcon from '@mui/icons-material/AddBox';
const isTeacher = false;
const StudentDashboard = () => {
  const [lessons, setLessons] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [enrollmentLink, setEnrollmentLink] = useState("");
  const [anchorEl, setAnchorEl] = useState(null); // Declare anchorEl and setAnchorEl
  const [isAddQuizDialogOpen, setIsAddQuizDialogOpen] = useState(false);
  const [subchapterId, setSubchapterId] = useState(null);
  const [quizDialogStates, setQuizDialogStates] = useState([]);
  const accessToken = localStorage.getItem("access_token");
  const [data, setdata] = useState();
  useEffect(() => {
    fetchLessonsData();
    fetchstudentdetails();
  }, []);
  // const fetchLessonsData = async () => {
  //   try {
  //     const lessonsResponse = await axios.get(`http://127.0.0.1:8000/accounts/lessons/`, {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });
  //     const lessonData = lessonsResponse.data;
  //     console.log(lessonData);
  //     const lessonsWithChapters = await Promise.all(lessonData.map(async (lesson) => {
  //       console.log("lesson:", lesson);
  //       const chaptersResponse = await axios.get(`http://127.0.0.1:8000/accounts/subchapters/?lesson=${lesson.id}`, {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       });
  //       return { ...lesson, chapters: chaptersResponse.data };
  //     }));
  //     setLessons(lessonsWithChapters);
  //     setQuizDialogStates(Array(lessonsWithChapters.length).fill(false));
  //     console.log("Lesson with Chapters:", lessonsWithChapters);
  //   } catch (error) {
  //     console.error("Error fetching lesson details:", error);
  //   }
  // };
  const fetchstudentdetails = async () => {
    try {
      const student_id = localStorage.getItem("student_id");
      const studentdata = await axios.get(`http://127.0.0.1:8000/accounts/students/${student_id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setdata(studentdata.response.data);
      console.log(data);
    }
    catch (error) {
      console.error("Error fetching student details:", error);
    }
  }
  const fetchLessonsData = async () => {
    try {
      // Fetch the logged-in student
      const student_id = localStorage.getItem("student_id");
      console.log(student_id);
      if (!student_id) {
        console.error("Student ID not found in local storage");
        return;
      }
      // const studentResponse = await axios.get(`http://127.0.0.1:8000/accounts/students/`, {
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`,
      //   },
      // });
      // const studentData = studentResponse.data;
      // console.log("Student Data:", studentData);
      // Fetch lessons associated with the student
      const enrolledLessonsResponse = await axios.get(`http://127.0.0.1:8000/accounts/lessons/?students=${student_id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const enrolledLessonsData = enrolledLessonsResponse.data;
      console.log("Enrolled Lessons Data:", enrolledLessonsData);
      // Fetch chapters for each enrolled lesson
      const lessonsWithChapters = await Promise.all(enrolledLessonsData.map(async (lesson) => {
        const chaptersResponse = await axios.get(`http://127.0.0.1:8000/accounts/subchapters/?lesson=${lesson.id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        return { ...lesson, chapters: chaptersResponse.data };
      }));

      setLessons(lessonsWithChapters);
      setQuizDialogStates(Array(lessonsWithChapters.length).fill(false));
      console.log("Lesson with Chapters:", lessonsWithChapters);
    } catch (error) {
      console.error("Error fetching lesson details:", error);
    }
  };

  const handleEnroll = async () => {
    try {
      const student_id = localStorage.getItem("student_id");
      const enrollmentLink = document.querySelector('input[type="text"]').value; // Get the value from the input field
      const response = await axios.post(
        "http://127.0.0.1:8000/accounts/enroll/",
        { enrollment_link: enrollmentLink, student_id: student_id },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      // Optionally, you can update the lessons state to reflect the enrollment status
    } catch (error) {
      console.error("Error enrolling in lesson:", error);
    }
  };

  const handleChapterClick = (lessonIndex, chapterIndex) => {
    const selectedLesson = lessons[lessonIndex];
    const selectedChapter = selectedLesson.chapters[chapterIndex];
    setSelectedChapter({
      lessonTitle: selectedLesson.title,
      chapterTitle: selectedChapter.title,
    });
    setSubchapterId(selectedChapter.id);
    // Set anchorEl to show the students seen menu
    setAnchorEl(
      document.getElementById(`students-menu-${lessonIndex}-${chapterIndex}`)
    );
  };



  // const [isAddQuizDialogOpen, setIsAddQuizDialogOpen] = useState(false);

  const handleAddQuiz = (lessonIndex) => {
    const updatedQuizDialogStates = [...quizDialogStates];
    updatedQuizDialogStates[lessonIndex] = true;
    setQuizDialogStates(updatedQuizDialogStates);
  };
  const handleCloseAddQuizDialog = (lessonIndex) => {
    const updatedQuizDialogStates = [...quizDialogStates];
    updatedQuizDialogStates[lessonIndex] = false;
    setQuizDialogStates(updatedQuizDialogStates);
  };

  return (
    <>
      <div style={{ margin: "20px" }}>
        <Typography variant="h6">Enroll in a Lesson</Typography>
        <input type="text" placeholder="Enter Enrollment Link" />
        <Button variant="contained" onClick={handleEnroll}>Enroll</Button>
      </div>
      <div style={{ display: 'flex' }}>
        <Box sx={{ m: 2, p: 2, height: 300, width: 200, border: 2 }} >
          {data ? (
            <>
              <Box display="flex" flexDirection="column" mt={2}>
                <Box display="flex" direction="row" justifyContent="center" sx={{ m: 2 }}>
                  <img src={data.photo} alt="User Photo" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                </Box>

                <Box display={"flex"} direction={"row"} justifyContent={"space-between"}>
                  <Typography variant="h6">{data.name}</Typography>
                </Box>
              </Box>
            </>) : (<Typography>Loading...</Typography>)}
        </Box>

        <div style={{ display: "flex", margin: "100px" }}>

          <div style={{ width: "15vw" }}>
            <Box style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
              <Typography >Lessons</Typography>
            </Box>
            {lessons && lessons.map((lesson, lessonIndex) => (
              <Accordion key={lessonIndex} expanded={lessonIndex === expandedLesson} onChange={() => setExpandedLesson(lessonIndex === expandedLesson ? null : lessonIndex)}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`lesson-${lessonIndex}-content`} id={`lesson-${lessonIndex}-header`}>
                  <Typography>{lesson.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {lesson.chapters && lesson.chapters.map((chapter, chapterIndex) => (
                      <ListItem key={chapterIndex} onClick={() => handleChapterClick(lessonIndex, chapterIndex)}>
                        <Button variant="contained">{chapter.title}</Button>
                      </ListItem>
                    ))}
                  </List>
                  <Button variant="outlined" onClick={() => handleAddQuiz(lessonIndex)}>Take Quiz</Button>
                  <Quizstudents inclose={quizDialogStates[lessonIndex]} onclose={() => handleCloseAddQuizDialog(lessonIndex)} title={lesson.lessonTitle} lessons={lessons} lessonindex={lessonIndex} />
                </AccordionDetails>
              </Accordion>

            ))}
          </div>

          <Box
            style={{
              flex: 1,
              border: "1px solid black",
              padding: "20px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {selectedChapter ? (
              <>
                <Box className="info"
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <Typography variant="h6" sx={{ ml: 1, mr: 1 }}>
                    {selectedChapter.lessonTitle}
                  </Typography>
                  <Typography variant="h6" sx={{ ml: 1, mr: 1 }}>
                    {selectedChapter.chapterTitle}
                  </Typography>
                </Box>
                <div className="pano-container">
                  <div className="pano-box">
                    <Pano subchapterId={subchapterId} isTeacher={isTeacher} />
                  </div>
                </div>
              </>
            ) : (
              <Typography variant="h6">Select a Chapter</Typography>
            )}
          </Box>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
