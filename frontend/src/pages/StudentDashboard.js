import React, { useState } from "react";
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

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Pano from "../components/Pano";
import AddBoxIcon from '@mui/icons-material/AddBox';

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

const lessons = [
  {
    lessonTitle: "Lesson 1",
    chapters: ["Chapter 1.1", "Chapter 1.2", "Chapter 1.3"],
    date: "2023-11-04",
    time: "09:00 AM",

  },
  {
    lessonTitle: "Lesson 2",
    chapters: ["Chapter 2.1", "Chapter 2.2"],
    date: "2023-11-05",
    time: "10:30 AM",

  },
  {
    lessonTitle: "Lesson 4",
    chapters: ["Chapter 4.1", "Chapter 4.2", "Chapter 4.3"],
    date: "2023-11-08",
    time: "09:45 AM",

  },
  {
    lessonTitle: "Lesson 5",
    chapters: ["Chapter 5.1", "Chapter 5.2"],
    date: "2023-11-09",
    time: "03:30 PM",

  },
  {
    lessonTitle: "Lesson 6",
    chapters: ["Chapter 6.1", "Chapter 6.2", "Chapter 6.3"],
    date: "2023-11-11",
    time: "11:20 AM",

  },
  {
    lessonTitle: "Lesson 7",
    chapters: ["Chapter 7.1", "Chapter 7.2", "Chapter 7.3", "Chapter 7.4"],
    date: "2023-11-12",
    time: "01:45 PM",

  },
  {
    lessonTitle: "Lesson 8",
    chapters: ["Chapter 8.1", "Chapter 8.2"],
    date: "2023-11-14",
    time: "10:00 AM",

  },

];

const StudentDashboard = () => {
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null); // Declare anchorEl and setAnchorEl
  const [isAddQuizDialogOpen, setIsAddQuizDialogOpen] = useState(false);

  const handleChapterClick = (lessonIndex, chapterIndex) => {
    const selectedLesson = lessons[lessonIndex];
    const selectedChapter = selectedLesson.chapters[chapterIndex];
    setSelectedChapter({
      lessonTitle: selectedLesson.lessonTitle,
      chapterTitle: selectedChapter,
      date: selectedLesson.date,
      time: selectedLesson.time,
      studentsSeen: selectedLesson.studentsSeen,
    });

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

          {lessons.map((lesson, lessonIndex) => (
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
                <Typography>{lesson.lessonTitle}</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <List>
                  {lesson.chapters.map((chapter, chapterIndex) => (
                    <ListItem
                      key={chapterIndex}
                      onClick={() =>
                        handleChapterClick(lessonIndex, chapterIndex)
                      }
                    >
                      <Button variant="contained" onClick={(e) => setAnchorEl(e.currentTarget)}>
                        {chapter}
                      </Button>
                    </ListItem>
                  ))}
                </List>
                <Button variant="outlined" onClick={handleAddQuiz}>Add Quiz</Button>
                <Quizstudents inclose={isAddQuizDialogOpen} onclose={handleCloseAddQuizDialog} quiz={quiz_questions} />
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
                <Typography variant="h6" sx={{ ml: 1, mr: 1 }} >
                  {selectedChapter.date}
                </Typography>
                <Typography variant="h6" sx={{ ml: 1, mr: 1 }}>
                  {selectedChapter.time}
                </Typography>

              </Box>
              <div className="pano-container">
                <div className="pano-box">
                  <Pano />
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
