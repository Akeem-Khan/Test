import * as React from 'react';
import { useContext } from "react";
import AuthContext from "../../context/auth.context";
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Fab from '@mui/material/Fab';

import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreVert';

import Button from '@mui/material/Button';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import Link from '@mui/material/Link';


const messages = [
    {
        id: 1,
        primary: 'Brunch this week?',
        secondary: "I'll be in the neighbourhood this week. Let's grab a bite to eat",
        person: '/static/images/avatar/5.jpg',
    },
    {
        id: 2,
        primary: 'Birthday Gift',
        secondary: `Do you have a suggestion for a good present for John on his work
      anniversary. I am really confused & would love your thoughts on it.`,
        person: '/static/images/avatar/1.jpg',
    },
    {
        id: 3,
        primary: 'Recipe to try',
        secondary: 'I am try out this new BBQ recipe, I think this might be amazing',
        person: '/static/images/avatar/2.jpg',
    },
    {
        id: 4,
        primary: 'Yes!',
        secondary: 'I have the tickets to the ReactConf for this year.',
        person: '/static/images/avatar/3.jpg',
    },
    {
        id: 5,
        primary: "Doctor's Appointment",
        secondary: 'My appointment for the doctor was rescheduled for next Saturday.',
        person: '/static/images/avatar/4.jpg',
    },
    {
        id: 6,
        primary: 'Discussion',
        secondary: `Menus that are generated by the bottom app bar (such as a bottom
      navigation drawer or overflow menu) open as bottom sheets at a higher elevation
      than the bar.`,
        person: '/static/images/avatar/5.jpg',
    },
    {
        id: 7,
        primary: 'Summer BBQ',
        secondary: `Who wants to have a cookout this weekend? I just got some furniture
      for my backyard and would love to fire up the grill.`,
        person: '/static/images/avatar/1.jpg',
    },
];

const StyledFab = styled(Fab)({
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
});

export default function Footer() {
    const { user } = useContext(AuthContext);

    return (
        <React.Fragment>
            <CssBaseline />
            <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
                <Toolbar>
                    <IconButton color="inherit" aria-label="open drawer">
                        <MenuIcon />
                    </IconButton>
                    <Button
                        component={RouterLink} to="/"


                        sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                        Notices
                    </Button>


                    {user !== undefined && (
                        <>
                            {user.loggedIn === false && (
                                <>
                                    <Button
                                        component={RouterLink} to="/register"

                                        sx={{ my: 2, color: 'white', display: 'block' }}
                                    >                                                    <Typography textAlign="center">Register</Typography>
                                    </Button>
                                    <Button
                                        component={RouterLink} to="/login"


                                        sx={{ my: 2, color: 'white', display: 'block' }}
                                    >
                                        <Typography textAlign="center">Login</Typography>
                                    </Button>
                                </>
                            )}

                            {((user.role === 'student_leader') || (user.role === 'faculty')) && (

                                <StyledFab color="secondary" aria-label="add" component={RouterLink} to="/create">
                                    <AddIcon />
                                </StyledFab>


                            )}

                            {user.role === 'faculty' && (
                                <Button
                                    component={RouterLink} to="/confirm"


                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    <Typography textAlign="center">Confirm student leader</Typography>
                                </Button>
                            )}

                            {user.loggedIn === true && (
                                <>
                                    <Button
                                        component={RouterLink} to="/profile"


                                        sx={{ my: 2, color: 'white', display: 'block' }}
                                    >
                                        <Typography textAlign="center">{user.name}</Typography>
                                    </Button>
                                </>
                            )}
                        </>
                    )}




                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton color="inherit">
                        <SearchIcon />
                    </IconButton>
                    <IconButton color="inherit">
                        <MoreIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
}
