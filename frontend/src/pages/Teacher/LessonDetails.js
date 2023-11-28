import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItem,
  Paper,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddBoxIcon from "@mui/icons-material/AddBox";
import EditIcon from "@mui/icons-material/Edit";

const lessons = [
  {
    lessonID: 1,
    lessonTitle: "Lesson 1",
    chapters: ["Chapter 1.1", "Chapter 1.2", "Chapter 1.3"],
    date: "2023-11-04",
    time: "09:00 AM",
  },
  {
    lessonID: 2,
    lessonTitle: "Lesson 2",
    chapters: ["Chapter 2.1", "Chapter 2.2", "Chapter 2.3"],
    date: "2024-01-04",
    time: "09:50 AM",
  },
  {
    lessonID: 3,
    lessonTitle: "Lesson 3",
    chapters: ["Chapter 3.1", "Chapter 3.2", "Chapter 3.3"],
    date: "2024-01-05",
    time: "11:50 AM",
  },
  {
    lessonID: 3,
    lessonTitle: "Lesson 3",
    chapters: ["Chapter 3.1", "Chapter 3.2", "Chapter 3.3"],
    date: "2024-01-05",
    time: "11:50 AM",
  },
  // Add more lessons here...
];

const LessonDetails = () => {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addLessonDialogOpen, setAddLessonDialogOpen] = useState(false);
  const [addChapterDialogOpen, setAddChapterDialogOpen] = useState(false);
  const [lessonName, setLessonName] = useState("");
  const [chapterName, setChapterName] = useState("");

  const handleLessonClick = (lessonIndex) => {
    setSelectedLesson(lessonIndex);
    setSelectedChapter(null);
  };

  const handleChapterClick = (lessonIndex, chapterIndex) => {
    setSelectedLesson(lessonIndex);
    setSelectedChapter(chapterIndex);
  };

  const handleEditLessonClick = () => {
    // Open the edit dialog for lesson name
    setLessonName(lessons[selectedLesson].lessonTitle);
    setEditDialogOpen(true);
  };

  const handleEditChapterClick = () => {
    // Open the edit dialog for chapter name
    setChapterName(lessons[selectedLesson].chapters[selectedChapter]);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    // Save the changes made in the edit dialog
    if (selectedLesson !== null) {
      const updatedLessons = [...lessons];
      if (selectedChapter !== null) {
        // Editing a chapter
        updatedLessons[selectedLesson].chapters[selectedChapter] = chapterName;
      } else {
        // Editing a lesson
        updatedLessons[selectedLesson].lessonTitle = lessonName;
      }
      setEditDialogOpen(false);
    }
  };

  const handleAddLessonClick = () => {
    // Open the dialog for adding a new lesson
    setAddLessonDialogOpen(true);
  };

  const handleAddChapterClick = (lessonIndex) => {
    // Open the dialog for adding a new chapter
    setSelectedLesson(lessonIndex);
    setAddChapterDialogOpen(true);
  };

  const handleSaveAddLesson = () => {
    // Save the new lesson data

    
  }


  const handleSaveAddChapter = () => {
    // Save the new chapter data
    if (selectedLesson !== null) {
      const updatedLessons = [...lessons];
      updatedLessons[selectedLesson].chapters.push(chapterName);
      setAddChapterDialogOpen(false);
    }
  };

  const handleCancel = () => {
    // Close the dialogs
    setEditDialogOpen(false);
    setAddLessonDialogOpen(false);
    setAddChapterDialogOpen(false);
  };

  return (
    <Box style={{ display: "flex", margin: "50px", width: "100%" }}>
      {/* Left Side: Lessons Accordion */}
      <Box style={{ width: "20%", marginRight: "20px" }}>
        {lessons.map((lesson, lessonIndex) => (
          <Accordion
            key={lessonIndex}
            expanded={lessonIndex === selectedLesson}
            onChange={() => handleLessonClick(lessonIndex)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`lesson-${lessonIndex}-content`}
              id={`lesson-${lessonIndex}-header`}
            >
              <Typography>
                {lesson.lessonTitle}
                <IconButton onClick={() => handleEditLessonClick()}>
                  <EditIcon />
                </IconButton>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {lesson.chapters.map((chapter, chapterIndex) => (
                  <ListItem
                    key={chapterIndex}
                    onClick={() =>
                      handleChapterClick(lessonIndex, chapterIndex)
                    }
                    style={{
                      backgroundColor:
                        lessonIndex === selectedLesson &&
                        chapterIndex === selectedChapter
                          ? "#b3e0ff" // Highlighted color
                          : "inherit",
                    }}
                  >
                    {chapter}
                    <IconButton onClick={() => handleEditChapterClick()}>
                      <EditIcon />
                    </IconButton>
                  </ListItem>
                ))}
                <IconButton onClick={() => handleAddChapterClick(lessonIndex)}>
                  <AddBoxIcon />
                </IconButton>
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
        <Button variant="contained" onClick={() => handleAddLessonClick()}>
          Add Lesson
        </Button>
      </Box>

      {/* Right Side: Lesson Details */}
      <Box style={{ flex: 1, padding: "20px", width: "60%", backgroundColor: "#DAF7A6" }}>
        <Typography variant="h6">
          {selectedLesson !== null ? `${lessons[selectedLesson].lessonTitle}` : ""}
        </Typography>
        <Typography variant="subtitle1">
          {selectedChapter !== null ? `${lessons[selectedLesson].chapters[selectedChapter]}` : ""}
        </Typography>
        {selectedLesson !== null && (
          <Box mt={2}>
            <Typography variant="body2">
              Date: {lessons[selectedLesson].date}
            </Typography>
            <Typography variant="body2">
              Time: {lessons[selectedLesson].time}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCancel}>
        <DialogTitle>Edit Details</DialogTitle>
        <DialogContent>
          {selectedChapter !== null ? (
            <TextField
              label="Chapter Name"
              value={chapterName}
              onChange={(e) => setChapterName(e.target.value)}
              fullWidth
            />
          ) : (
            <TextField
              label="Lesson Name"
              value={lessonName}
              onChange={(e) => setLessonName(e.target.value)}
              fullWidth
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Lesson Dialog */}
      <Dialog open={addLessonDialogOpen} onClose={handleCancel}>
        <DialogTitle>Add Lesson</DialogTitle>
        <DialogContent>
          <TextField
            label="Lesson Name"
            value={lessonName}
            onChange={(e) => setLessonName(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveAddLesson} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Chapter Dialog */}
      <Dialog open={addChapterDialogOpen} onClose={handleCancel}>
        <DialogTitle>Add Chapter</DialogTitle>
        <DialogContent>
          <TextField
            label="Chapter Name"
            value={chapterName}
            onChange={(e) => setChapterName(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveAddChapter} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LessonDetails;
