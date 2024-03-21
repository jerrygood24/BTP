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
const quiz_questions = {
  questions: [
      {
          id: 1,
          text: "What is the capital of France?",
          options: [
              { id: 1, text: "Paris", isCorrect: true },
              { id: 2, text: "London", isCorrect: false },
              { id: 3, text: "Berlin", isCorrect: false },
              { id: 4, text: "Rome", isCorrect: false },
          ],
      },
      {
          id: 2,
          text: "Which planet is known as the Red Planet?",
          options: [
              { id: 1, text: "Mars", isCorrect: true },
              { id: 2, text: "Venus", isCorrect: false },
              { id: 3, text: "Jupiter", isCorrect: false },
              { id: 4, text: "Saturn", isCorrect: false },
          ],
      },
  ],
};

const StudentDashboard = () => {
  const [lessons, setLessons] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null); // Declare anchorEl and setAnchorEl
  const [isAddQuizDialogOpen, setIsAddQuizDialogOpen] = useState(false);
  const [subchapterId, setSubchapterId] = useState(null);
  const accessToken = localStorage.getItem("access_token");
  useEffect(() => {
    fetchLessonsData();
  }, []);
  const fetchLessonsData = async () => {
    // axios.get(`http://127.0.0.1:8000/accounts/lessons/`, {
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`,
    //   },})
    // .then(response => {
    //   console.log('Lessons:', response.data);
    //   setLessons(response.data);
    // })
    // .catch(error => {
    //   console.error('Error fetching lessons:', error);
    // });
    try {
      const lessonsResponse = await axios.get(`http://127.0.0.1:8000/accounts/lessons/`, {
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
      setLessons(lessonsWithChapters);
      console.log("Lesson with Chapters:", lessonsWithChapters);
    } catch (error) {
      console.error("Error fetching lesson details:", error);
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

  const closeStudentsMenu = () => {
    setAnchorEl(null);
  };

  // const [isAddQuizDialogOpen, setIsAddQuizDialogOpen] = useState(false);

  const handleAddQuiz = () => {
    setIsAddQuizDialogOpen(true);
  };
  const handleCloseAddQuizDialog = () => {
    setIsAddQuizDialogOpen(false);
  };

  return (
    <>
      <div style={{ display: "flex", margin: "100px" }}>

        <div style={{ width: "15vw" }}>
          <Box style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <Typography >Lessons</Typography>

            <IconButton sx={{ ml: 1, mr: 1 }}>
              {/* <AddBoxIcon/> */}
            </IconButton>

          </Box>

          {lessons && lessons.map((lesson, lessonIndex) => (
            <Accordion
              key={lessonIndex}
              expanded={lessonIndex === expandedLesson}
              onChange={() =>
                setExpandedLesson(
                  lessonIndex === expandedLesson ? null : lessonIndex
                )
              }
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`lesson-${lessonIndex}-content`}
                id={`lesson-${lessonIndex}-header`}
              >
                <Typography>{lesson.title}</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <List>
                  {lesson.chapters && lesson.chapters.map((chapter, chapterIndex) => (
                    <ListItem
                      key={chapterIndex}
                      onClick={() =>
                        handleChapterClick(lessonIndex, chapterIndex)
                      }
                    >
                      <Button variant="contained" onClick={(e) => setAnchorEl(e.currentTarget)}>
                        {chapter.title}
                      </Button>
                    </ListItem>
                  ))}
                </List>
                <Button variant="outlined" onClick={handleAddQuiz}>Take Quiz</Button>
                <Quizstudents inclose={isAddQuizDialogOpen} onclose={handleCloseAddQuizDialog} quiz={quiz_questions} title={lesson.lessonTitle} />
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
    </>
  );
};

export default StudentDashboard;
