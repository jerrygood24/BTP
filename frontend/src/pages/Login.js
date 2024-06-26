import * as React from 'react';
import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TeacherDashboard from './TeacherDashboard'
import StudentDashboard from './StudentDashboard';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignIn({ isLoggedIn, setIsLoggedIn, setIsTeacher }) {
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/'); // Redirect to home page if already logged in
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const response = await axios.post('http://127.0.0.1:8000/accounts/dj-rest-auth/login/', {
        username: data.get('username'),
        password: data.get('password'),
      });
      console.log(response);

      if (response.status === 200) {
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', true);
        //set the access_token in the localstorage
        // response.json().then(data => {
        //   const token = data.access;
        //   localStorage.setItem('authToken', token);
        // });
        // setAccessToken(response.data['Token']);
        // const accessToken = response.data.access_token;
        // localStorage.setItem('access_token', accessToken);
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('user_id', response.data.user.pk);
        // console.log(response.data.user.pk);
        const role = response.data.user.role;
        localStorage.setItem('role', role);
        setIsTeacher(role === 'teacher');
        console.log(response.data);
        if (response.data.user.role === 'teacher') {
          setIsTeacher(true);
          const userResponse = await axios.get(`http://127.0.0.1:8000/accounts/teachers/`, {
            headers: {
              Authorization: `Bearer ${response.data.access}`
            }
          });
          console.log(userResponse);
          localStorage.setItem('teacher_id', userResponse.data[0].id);
          console.log(userResponse.data[0].id);
          navigate('/teacherdashboard');
        }
        else {
          const userResponse = await axios.get(`http://127.0.0.1:8000/accounts/students/`, {
            headers: {
              Authorization: `Bearer ${response.data.access}`
            }
          });
          console.log(userResponse);
          localStorage.setItem('student_id', userResponse.data[0].id);
          console.log(userResponse.data[0].id);
          // localStorage.setItem('student_id', response.data.user.student);
          // localStorage.setItem('student_id', response.data.user.student);
          setIsTeacher(false);
          navigate('/studentdashboard');
        }
        return (<div> DON DON DON</div>);
        // response.json().then(data => {
        //   const token = data.access;
        //   localStorage.setItem('authToken', token);
        // });
        // setAccessToken(response.data['Token']);
        // const accessToken = response.data.access_token;
        // localStorage.setItem('access_token', accessToken);
        return (<div> DON DON DON</div>);
      }
      else {
        // invalid details dikhadenge
      }
    } catch (error) {
      // Handle network error 
    }
  };
  


  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        {/* {isLoggedIn && isTeacher && <Redirect to="/teacherdashboard" />} Redirect to teacher dashboard if user is teacher
        {isLoggedIn && !isTeacher && <Redirect to="/studentdashboard" />} */}
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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="User Name"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            {/* {isLoggedIn && <div>You have successfully logged in.</div>} */}
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
