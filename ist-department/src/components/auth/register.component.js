import axios from "axios";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../context/auth.context";
import { GoogleLogin } from 'react-google-login';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useStyles from './styles';

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState(false);
  const [buttonText, setButtonText] = useState("Register");

  const { getUser } = useContext(AuthContext);
  const history = useHistory();
  const classes = useStyles();

  const googleSuccess = async (res) => {
    const result = res?.profileObj;
    const token = res?.tokenId;


  };

  const googleError = () => alert('Google Sign In was unsuccessful. Try again later');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    try {
      const res = await axios.post("/auth/register.component", {
        name,
        email,
        password,
        passwordVerify,

      });
      res.data && window.location.replace("/login.component");
    } catch (err) {
      setError(true);
    }
  };

  async function register(e) {
    e.preventDefault();
    const isValidEmail = email.split('@');

    try {
      if (isValidEmail[1] === 'my.costaatt.edu.tt' || isValidEmail[1] === 'gmail.com') {
        const registerData = {
          name,
          email,
          password,
          passwordVerify,
          role: 'student',
        };

        await axios.post(`${process.env.REACT_APP_API}/auth/`, registerData);
        await getUser();

        setButtonText("Email Sent");

        setTimeout(() => {
          history.push('/');
        }, 5000);
      }

      else if (isValidEmail[1] === 'costaatt.edu.tt') {
        const registerData = {
          name,
          email,
          password,
          passwordVerify,
          role: 'faculty',
        };

        await axios.post(`${process.env.REACT_APP_API}/auth/`, registerData);
        await getUser();

        setButtonText("Email Sent");

        setTimeout(() => {
          history.push('/');
        }, 5000);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Box component="form" onSubmit={register} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoFocus

              onChange={(e) => setName(e.target.value)}
              value={name}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"

              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"

              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="passwordVerify"
              label="Verify Password"
              type="password"
              id="passwordVerify"

              onChange={(e) => setPasswordVerify(e.target.value)}
              value={passwordVerify}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {buttonText}
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Register;
