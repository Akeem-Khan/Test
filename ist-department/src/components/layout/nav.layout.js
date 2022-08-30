import { useContext } from "react";
import AuthContext from "../../context/auth.context";
import PersonIcon from '@mui/icons-material/Person';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import LogOutBtn from "../auth/logout-btn.component";
import logo from "../../logo.png";
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Link from '@mui/material/Link';
import { useHistory } from "react-router-dom";
import axios from "axios";
import AdvismentModal from '../calender/advisementModal'

function Navbar() {
    const { user } = useContext(AuthContext);
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const pages = ['Products', 'Pricing', 'Blog'];
    const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
    const [open, setOpen] = React.useState(false);

    const handleModalOpen = () => {
        setOpen(true);
    };

    const handleModalClose = (e) => {
        //if(reason == 'backdropClick') return;
        console.log(e)
        setOpen(false);
    };

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const { getUser } = useContext(AuthContext);

    const history = useHistory();

    const logOut = async () => {
        await axios.get(`${process.env.REACT_APP_API}/auth/logout`);
        await getUser();
        history.push("/");
    }
    console.log(user)
    return (

        <>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
                        <Avatar sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} alt="IST" src={logo} />

                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            IST - Department
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                }}
                            >


                                <Link to="/">
                                    <MenuItem onClick={handleCloseNavMenu}>
                                        <Typography textAlign="center">Notices</Typography>
                                    </MenuItem>

                                </Link>




                            </Menu>
                        </Box>
                        <Avatar  sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} alt="IST" src={logo} />

                        {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href=""
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            IST Department
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>

                            {user !== undefined && (
                                <>
                                    {user.loggedIn === false && (


                                        <>
                                            <Button
                                                component={RouterLink} to="/register"

                                                onClick={handleCloseNavMenu}
                                                sx={{ my: 2, color: 'white', display: 'block' }}
                                            >
                                                Register
                                            </Button>
                                            <Button
                                                component={RouterLink} to="/login"

                                                onClick={handleCloseNavMenu}
                                                sx={{ my: 2, color: 'white', display: 'block' }}
                                            >
                                                Log in
                                            </Button>

                                        </>
                                    )}

                                    {((user.role === 'student_leader') || (user.role === 'faculty')) && (
                                        <Button
                                            component={RouterLink} to="/create"

                                            onClick={handleCloseNavMenu}
                                            sx={{ my: 2, color: 'white', display: 'block' }}
                                        >
                                            Create Notice
                                        </Button>
                                    )}

                                    {user.role === 'faculty' && (
                                        <Button
                                            component={RouterLink} to="/confirm"

                                            onClick={handleCloseNavMenu}
                                            sx={{ my: 2, color: 'white', display: 'block' }}
                                        >
                                            Confirm Student Leader
                                        </Button>

                                    )}

                                    {user.loggedIn === true && (
                                        <>
                                            <Button
                                                component={RouterLink} to="/cal"

                                                onClick={handleCloseNavMenu}
                                                sx={{ my: 2, color: 'white', display: 'block' }}
                                            >
                                                Calendar
                                            </Button>
                                            {user.role != 'faculty'  &&
                                            <Button
                                                

                                                onClick={handleModalOpen}
                                                sx={{ my: 2, color: 'white', display: 'block' }}
                                            >
                                                Book Advisement
                                            </Button>
                                            }
                                            <Button
                                                component={RouterLink} to="/chat"

                                                onClick={handleCloseNavMenu}
                                                sx={{ my: 2, color: 'white', display: 'block' }}
                                            >
                                                Chat
                                            </Button>
                                        </>
                                    )}
                                </>
                            )}
                        </Box>

                        <Box sx={{ flexGrow: 0 }}>
                            {user !== undefined && (
                                <>

                                    {user.loggedIn === true && (
                                        <>
                                            <Tooltip title="Open settings">
                                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                                    <Avatar><PersonIcon /></Avatar>

                                                </IconButton>
                                            </Tooltip>
                                        </>
                                    )}
                                    <Menu
                                        sx={{ mt: '45px' }}
                                        id="menu-appbar"
                                        anchorEl={anchorElUser}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                    >

                                        {user !== undefined && (
                                            <>

                                                {user.loggedIn === true && (
                                                    <>
                                                        <MenuItem to="/profile" component={RouterLink}>
                                                            <Typography textAlign="center">My Profile</Typography>
                                                        </MenuItem>
                                                        <MenuItem onClick={logOut}>
                                                            <Typography textAlign="center">Log Out</Typography>
                                                        </MenuItem>

                                                    </>
                                                )}
                                            </>
                                        )}
                                    </Menu>
                                </>
                            )}


                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <AdvismentModal handleClose={handleModalClose} open={open} user={user} />
        </>

    );

}

export default Navbar;
