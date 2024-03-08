import React, { useEffect, useState } from "react";
import "../../css/Repository.css";

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
import QuizDialog from "./Quiz";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Pano from "../../components/Pano";
import AddBoxIcon from '@mui/icons-material/AddBox';
import { ConstructionOutlined } from "@mui/icons-material";

const lessons = [
  {
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
  },
  // Add more lessons here...
];

const LessonDetails = (props) => {
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null); // Declare anchorEl and setAnchorEl
  // const [newChapter, setNewChapter] = useState("");
  const [isAddSubChapterDialogOpen, setIsAddSubChapterDialogOpen] = useState(false);
  const [isAddQuizDialogOpen, setIsAddQuizDialogOpen] = useState(false);

  const handleAddQuiz = () => {
    setIsAddQuizDialogOpen(true);
  };

  const handleCloseAddQuizDialog = () => {
    setIsAddQuizDialogOpen(false);
  };

  const handleAddQuizSubmit = (quizData) => {
    // Implement logic to add the quiz data to the lesson
    // You can access the lesson details using props.lessonDetails
    // Update the lesson details with the new quiz data
    // Close the dialog
    console.log(quizData);
  };

  const handleAddChapter = (lessonIndex) => {
    let newChapter = window.prompt("Enter Lesson Title:");
    if (newChapter) {
      const updatedLessons = [...props.lessonDetails];
      updatedLessons[lessonIndex].chapters.push(newChapter);
      props.setLesson(updatedLessons);
      newChapter = "";
    } else {
      alert("Please enter a chapter name.");
    }
  };
  const handleAddLesson = () => {
    // Show a prompt to fill in the lesson title
    const lessonTitle = window.prompt("Enter Lesson Title:");
    // console.log(lessonTitle);
    if (lessonTitle) {
      // Update the newLesson state with the lesson title
      const newLesson = {
        lessonTitle,
        chapters: [],
      };
      console.log(newLesson);
      props.setLesson([...props.lessonDetails, newLesson]);
      console.log(props.lessonDetails);
      // Prompt for adding the first chapter
      // handleAddChapter();
    } else {
      alert("Lesson title cannot be empty.");
    }
  };

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

  return (
    <>
      <div style={{ display: "flex", margin: "100px" }}>

        <div style={{ width: "15vw" }}>
          <Box style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <Typography >Lessons</Typography>
            <IconButton sx={{ ml: 1, mr: 1 }} onClick={handleAddLesson}>
              <AddBoxIcon />
            </IconButton>

          </Box>

          {props.lessonDetails.map((lesson, lessonIndex) => (
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
                <Button variant="outlined" onClick={() => handleAddChapter(lessonIndex)}>Add Chapter</Button>
                <Button variant="outlined"  onClick={handleAddQuiz}>Add Quiz</Button>
                <QuizDialog isOpen={isAddQuizDialogOpen} onClose={handleCloseAddQuizDialog} onAddQuiz={handleAddQuizSubmit} />
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
                {console.log(selectedChapter)}
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
                <Button
                  id="students-menu"
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                  Students Seen
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={closeStudentsMenu}
                >
                  {selectedChapter.studentsSeen.map((student, index) => (
                    <MenuItem key={index}>{student}</MenuItem>
                  ))}
                </Menu>
              </Box>
              <div className="pano-container">
                <div className="pano-box">
                  {/* <Pano /> */}
                </div>
              </div>
            </>
          ) : (
            <Typography variant="h6">Select a Chapter!</Typography>
          )}
        </Box>
        
      </div>
    </>
  );
};

export default LessonDetails;
