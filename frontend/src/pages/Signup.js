import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';

function SignUp() {
  const [showTeacherDetails, setShowTeacherDetails] = useState(false);
  const [teacherDetails, setTeacherDetails] = useState({
    user: '',
    name: '',
    designation: '',
    subject: '',
    photo: null,
  });
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // console.log(data.get('username'));
    const dataToSend = {
      first_name: data.get('firstname'),
      last_name: data.get('lastname'),
      password1: data.get('password1'),
      password2: data.get('password2'),
      role: data.get('role'),
      username: data.get('username'),
    };
    try {
      const response = await axios.post('http://127.0.0.1:8000/accounts/register/', dataToSend, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.status === 200) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('user_id', response.data.user_id);
        // console.log("user id:", response.data)
        console.log("Successfull signup ", response.data);
        if (dataToSend.role === 'teacher') {
          setShowTeacherDetails(true);
        }
        return (<div> Don DON Don</div>);
      }
      else {
        // invalid details dikhadenge
      }
    } catch (error) {
      // Handle network error
      console.error("Error:", error.response.data);
    }
  };
  const handleTeacherDetailsSubmit = async (event) => {
    event.preventDefault();
    const userId = localStorage.getItem('user_id');
    const formData = new FormData();
    formData.append('user', userId);
    formData.append('name', teacherDetails.name);
    formData.append('designation', teacherDetails.designation);
    formData.append('subject', teacherDetails.subject);
    formData.append('photo', teacherDetails.photo);

    try {
      const response = await axios.post('http://127.0.0.1:8000/accounts/teachers/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.status === 201) {
        // Handle successful submission of teacher details
        localStorage.setItem('teacher_id', response.data.id);
        console.log("Teacher ID stored in localStorage:", localStorage.getItem('teacher_id'));
        console.log("Teacher details submitted successfully");
      } else {
        // Handle other response statuses
      }
    } catch (error) {
      console.error("Error:", error.response.data);
    }
  };
  const handleTeacherInputChange = (event) => {
    const { name, value } = event.target;
    setTeacherDetails(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Function to handle photo upload for teacher details
  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    setTeacherDetails(prevState => ({
      ...prevState,
      photo: file,
    }));
  };


  return (
    <ThemeProvider theme={createTheme()}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <PersonAddIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="firstname"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastname"
                  autoComplete="lname"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="User Name"
                  name="username"
                  autoComplete="username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password1"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password2"
                  label="Confirm Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <label>Role:</label>
                <select name="role" required>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </Grid>
              {/* Additional fields can be added here */}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
          {showTeacherDetails && (
            <Box component="form" onSubmit={handleTeacherDetailsSubmit} noValidate sx={{ mt: 3 }}>
              <TextField
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                value={teacherDetails.name}
                onChange={handleTeacherInputChange}
              />
              <TextField
                required
                fullWidth
                id="designation"
                label="Designation"
                name="designation"
                value={teacherDetails.designation}
                onChange={handleTeacherInputChange}
              />
              <TextField
                required
                fullWidth
                id="subject"
                label="Subject"
                name="subject"
                value={teacherDetails.subject}
                onChange={handleTeacherInputChange}
              />
              <input
                type="file"
                onChange={handlePhotoUpload}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Submit Teacher Details
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default SignUp;
