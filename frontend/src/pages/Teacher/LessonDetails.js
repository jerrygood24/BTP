import React, { useEffect, useState } from "react";
import "../../css/Repository.css";
import FileUpload from "../../components/FileUpload";
import Pano from "../../components/Pano";
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
import AddBoxIcon from '@mui/icons-material/AddBox';
import axios from "axios";

const LessonDetails = ({ lessonDetails, setLessonDetails }) => {
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isAddQuizDialogOpen, setIsAddQuizDialogOpen] = useState(false);
  const [subchapterId, setSubchapterId] = useState(null);
  const [scenes, setScenes] = useState([]);
  const handleAddQuiz = () => {
    setIsAddQuizDialogOpen(true);
  };

  const handleCloseAddQuizDialog = () => {
    setIsAddQuizDialogOpen(false);
  };

  const handleAddChapter = async (lessonIndex) => {
    console.log("lessonIndex", lessonIndex);
    try {
      const accessToken = localStorage.getItem('access_token');
      const lessonId = lessonDetails[lessonIndex].id;
      console.log("lessonId", lessonId);
      const newChapterTitle = prompt("Enter Chapter Title:");
      if (newChapterTitle) {
        const response = await axios.post("http://127.0.0.1:8000/accounts/subchapters/", {
          lesson: lessonId,
          title: newChapterTitle,
        },{
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const updatedLessonDetails = [...lessonDetails];
        updatedLessonDetails[lessonIndex].chapters.push(response.data);
        setLessonDetails(updatedLessonDetails);
      } else {
        alert("Please enter a chapter title.");
      }
    } catch (error) {
      console.error("Error adding chapter:", error);
    }
  };

  const handleAddLesson = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      const newLessonTitle = prompt("Enter Lesson Title:");
      // console.log("teacher id:", localStorage.getItem("teacher_id"));
      // console.log(newLessonTitle);
      if (newLessonTitle) {
        const response = await axios.post("http://127.0.0.1:8000/accounts/lessons/", {
          teacher: localStorage.getItem("teacher_id"),
          title: newLessonTitle,
        }, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log("response:", response.data);
        setLessonDetails([...lessonDetails, response.data]);
      } else {
        alert("Please enter a lesson title.");
      }
    } catch (error) {
      console.error("Error adding lesson:", error);
    }
  };

  const handleChapterClick = (lessonIndex, chapterIndex) => {
    const selectedLesson = lessonDetails[lessonIndex];
    const selectedChapter = selectedLesson.chapters[chapterIndex];
    console.log('Lesson Index:', lessonIndex);
  console.log('Chapter Index:', chapterIndex);
  console.log('Selected Lesson:', lessonDetails[lessonIndex]);
  console.log('Selected Chapter:', lessonDetails[lessonIndex]?.chapters[chapterIndex]);
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

  return (
    <>
      <div style={{ display: "flex", margin: "100px" }}>
        <div style={{ width: "15vw" }}>
          <Box style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <Typography>Lessons</Typography>
            <IconButton sx={{ ml: 1, mr: 1 }} onClick={handleAddLesson}>
              <AddBoxIcon />
            </IconButton>
          </Box>
  
          {lessonDetails && lessonDetails.map((lesson, lessonIndex) => (
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
                      <Button variant="contained">
                        {chapter.title}
                      </Button>
                    </ListItem>
                  ))}
                </List>
                <Button variant="outlined" onClick={() => handleAddChapter(lessonIndex)}>Add Chapter</Button>
                <Button variant="outlined" onClick={handleAddQuiz}>Add Quiz</Button>
                <QuizDialog isOpen={isAddQuizDialogOpen} onClose={handleCloseAddQuizDialog} />
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
              <Box className="info" style={{ display: "flex", flexDirection: "row" }}>
                <Typography variant="h6" sx={{ ml: 1, mr: 1 }}>
                  {selectedChapter.lessonTitle}
                </Typography>
                <Typography variant="h6" sx={{ ml: 1, mr: 1 }}>
                  {selectedChapter.chapterTitle}
                </Typography>
              </Box>
              <FileUpload subchapterId={subchapterId} />
              <div className="pano-container">
                <div className="pano-box">
                <Pano subchapterId={subchapterId} />
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
