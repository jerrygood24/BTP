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
const TeacherDetails = ({ teacherId }) => {
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
      console.log(accessToken);
      if (accessToken) {
        axios.get(`http://127.0.0.1:8000/accounts/teachers/${teacherId}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
          .then(response => {
            const updatedData = {
              ...response.data,
              subjects: [response.data.subject]
            };
            setData(updatedData);
            setEditData(updatedData);
            console.log(updatedData);
          })
          .catch(error => {
            console.error("Error fetching teacher details:", error);
          });
      } else {
        console.error("Access token not found in local storage");
      }
    }
  }, [teacherId]);
  const [studentsmenuanchor, setStudentsmenuanchor] = useState(null);
  const [subjectMenuAnchor, setSubjectMenuAnchor] = useState(null);
  const [subhead, setsubhead] = useState("Subjects");
  const [students, setStudents] = useState(['Klaus', 'Ella D Verma', 'Stefen', 'Louis']);
  const [subject_selected, setsubject_selected] = useState(false);
  // const handleSubjectClick = (subject) => {
  //   setSubjectMenuAnchor(null);
  //   setsubhead(subject);
  //   // props.onSubjectSelect(subject);
  //   setsubject_selected(true);
  //   // handleEditClick("Subject");
  // };
  const handleSubjectClick = (event) => {
    setSubjectMenuAnchor(event.currentTarget);
  };

  const handleStudentClick = (subject) => {

    //open student dashboard
  };

  const handleEditClick = (field) => {
    setEditData({ ...data });
    setEditMode(field);
  };

  const handleSaveClick = () => {
    setData({ ...editData });
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
    <Box sx={{ m: 2, p: 2, height: 300, width: 200, border: 2 }} >
      {data ? (
        <>
          <Box display="flex" flexDirection="column" mt={2}>
            <Box display={"flex"} direction={"row"} justifyContent={"center"} sx={{ m: 2 }}>
              <Avatar>A</Avatar>
            </Box>

            <Box display={"flex"} direction={"row"} justifyContent={"space-between"}>
              <Typography variant="h6">{data.name}</Typography>
              <IconButton onClick={() => handleEditClick("Name")}>
                <EditIcon />
              </IconButton>
            </Box>

            <Box display="flex" flexDirection="row" alignItems="center" justifyContent={"space-between"}>
              <Typography>{data.designation}</Typography>
              <IconButton onClick={() => handleEditClick("organization name")}>
                <EditIcon />
              </IconButton>
            </Box>

            <Box display={"flex"} direction={"row"} alignItems="center" justifyContent={"space-between"}>
              <Box>
                <Typography onClick={(e) => { setSubjectMenuAnchor(e.currentTarget) }}>
                  Subjects <ExpandMoreIcon />
                </Typography>
                <Menu
                  anchorEl={subjectMenuAnchor}
                  open={Boolean(subjectMenuAnchor)}
                  onClose={() => setSubjectMenuAnchor(null)}
                >
                  {data.subject && Array.isArray(data.subjects) && data.subjects.map((subject, index) => (
                    <MenuItem key={index}
                    // onClick={() => handleSubjectClick(subject)}
                    >
                      {subject}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Box>

            <Typography>Total Subjects: {data.subjects.length}</Typography>
          </Box>

          {editMode && (
            <Dialog open={editMode} onClose={handleClose}>
              <DialogTitle>Edit {editMode}</DialogTitle>
              <DialogContent>
                <TextField
                  //   label={editMode}
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
          {subject_selected && (<Box display={"flex"} direction={"row"} alignItems="center" justifyContent={"space-between"}>
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
