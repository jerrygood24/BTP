import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  TextField,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
const TeacherDetails = ({teacherId}) => {
  console.log("teacherId: this one", teacherId);
  const [data, setData] = useState(null); 
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  // const initialData = {
  //   profilePicture: "img/profile.png",
  //   name: "Aditya Rathore",
  //   organizationname: "IIT Kharagpur",
  //   subject: ['Mathematics', 'English', 'Science', 'Hindi'],
  // };
  // axios.get("http://127.0.0.1:8000/accounts/teachers/1/").then(response => (console.log(response)));
  useEffect(() => {
    if (teacherId) {
      const accessToken = localStorage.getItem("access_token");
      if (accessToken) {
        axios.get(`http://127.0.0.1:8000/accounts/teachers/${teacherId}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        .then(response => {
          setData(response.data);
          setEditData(response.data);
        })
        .catch(error => {
          console.error("Error fetching teacher details:", error);
        });
      } else {
        console.error("Access token not found in local storage");
      }
    }
  }, [teacherId]);



  // const [data, setData] = useState(initialData);
  const [subjectMenuAnchor, setSubjectMenuAnchor] = useState(null);
  const [studentsmenuanchor, setStudentsmenuanchor] = useState(null);
  const [subhead, setsubhead] = useState("Subjects");
  const [students, setStudents] = useState(['Klaus', 'Ella D Verma', 'Stefen', 'Louis']);
  const [subject_selected, setsubject_selected] = useState(false);
  const handleSubjectClick = (subject) => {
    setSubjectMenuAnchor(null);
    setsubhead(subject);
    setsubject_selected(true);
    // handleEditClick("Subject");
  };
  const handleStudentClick = (subject) => {

    //open student dashboard
  };

  const handleEditClick = (field) => {
    // setEditData({ ...data });
    setEditMode(field);
  };

  const handleSaveClick = () => {
    setData(editData );
    setEditMode(false);
  };

  const handleClose = () => {
    setEditMode(false);
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });

    //Backend walo yaha se dekh lena api call
  };

  return (
    <Box sx={{ m: 2, p: 2, height: 300, width: 200, border: 2 }}>
      {data ? (
        <>
          <Box display="flex" flexDirection="column" mt={2}>
            <Box display="flex" direction="row" justifyContent="center" sx={{ m: 2 }}>
              <Avatar>A</Avatar>
            </Box>

            <Box display="flex" direction="row" justifyContent="space-between">
              <Typography variant="h6">{data.name}</Typography>
              <IconButton onClick={() => handleEditClick("Name")}>
                <EditIcon />
              </IconButton>
            </Box>

            <Box display="flex" direction="row" alignItems="center" justifyContent="space-between">
              <Typography>{data.organizationname}</Typography>
              <IconButton onClick={() => handleEditClick("organizationname")}>
                <EditIcon />
              </IconButton>
            </Box>

            <Box display="flex" direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography onClick={(e) => setSubjectMenuAnchor(e.currentTarget)}>
                  {subhead} <ExpandMoreIcon />
                </Typography>
                <Menu
                  anchorEl={subjectMenuAnchor}
                  open={Boolean(subjectMenuAnchor)}
                  onClose={() => setSubjectMenuAnchor(null)}
                >
                  {data.subject && Array.isArray(data.subject) && data.subject.map((subject, index) => (
                    <MenuItem key={index} onClick={() => handleSubjectClick(subject)}>
                      {subject}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Box>

            <Typography>Total Subjects: {data.subject && data.subject.length}</Typography>
          </Box>

          {editMode && (
            <Dialog open={editMode} onClose={handleClose}>
              <DialogTitle>Edit {editMode}</DialogTitle>
              <DialogContent>
                <TextField
                  name={editMode.toLowerCase()}
                  value={editData[editMode.toLowerCase()]}
                  onChange={handleChange}
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleSaveClick} color="primary">
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          )}

          {subject_selected && (
            <Box display="flex" direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography onClick={(e) => setStudentsmenuanchor(e.currentTarget)}>
                  Students <ExpandMoreIcon />
                </Typography>
                <Menu
                  anchorEl={studentsmenuanchor}
                  open={Boolean(studentsmenuanchor)}
                  onClose={() => setStudentsmenuanchor(null)}
                >
                  {students.map((student, index) => (
                    <MenuItem key={index} onClick={() => handleStudentClick(student)}>
                      {student}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Box>
          )}
        </>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Box>
  );
};

export default TeacherDetails;
