import React, { useState } from "react";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DialogTitle from "@mui/material/DialogTitle";

const TeacherDetails = () => {
  const initialData = {
    profilePicture: "img/profile.png",
    name: "Harsh Jha",
    organizationname: "IIT Kharagpur",
    subject: "Mathematics",
    totalLessons: 10,
  };

  const [data, setData] = useState(initialData);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ ...initialData });

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
    <Box sx={{ m: 2, p: 2 ,height:300,width:200, border:2}} >
     
      <Box display="flex" flexDirection="column" mt={2}>
        <Box display={"flex"} direction={"row"} justifyContent={"center"} sx={{m:2}}>
          <Avatar>H</Avatar>
        </Box>

        <Box display={"flex"} direction={"row"} justifyContent={"space-between"}>
          <Typography variant="h6">{data.name}</Typography>
          <IconButton onClick={() => handleEditClick("Name")}>
            <EditIcon />
          </IconButton>
        </Box>

        <Box display="flex" flexDirection="row" alignItems="center" justifyContent={"space-between"}>
          <Typography>{data.organizationname}</Typography>
          <IconButton onClick={() => handleEditClick("organizationname")}>
            <EditIcon />
          </IconButton>
        </Box>

        <Box display={"flex"} direction={"row"} alignItems="center"  justifyContent={"space-between"}>
          <Typography>{data.subject}</Typography>

          <IconButton onClick={() => handleEditClick("Subject")}>
            <EditIcon />
          </IconButton>
        </Box>

        <Typography>Total Lessons: {data.totalLessons}</Typography>
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
    </Box>
  );
};

export default TeacherDetails;
