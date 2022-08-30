import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import AuthContext from "../../context/auth.context";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';

const server = process.env.REACT_APP_API;


function useForceUpdate() {
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}

function Profile() {
    const { user, getUser } = useContext(AuthContext);
    const [notices, setNotices] = useState([]);
    const forceUpdate = useForceUpdate();

    useEffect(() => {
        axios.get(`${server}notices/`)
            .then(response => {
                setNotices(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    function apply() {
        const role = {
            role: 'pending'
        };

        axios.post(`${server}auth/update/${user.id}`, role)
            .then(res => {
                getUser();
            })
            .catch(err => {
                console.log(err);
            });

        forceUpdate();
    }

    function revert() {
        const role = {
            role: 'student'
        };

        axios.post(`${server}auth/update/${user.id}`, role)
            .then(res => {
                getUser();
            })
            .catch(err => {
                console.log(err);
            });

        forceUpdate();
    }

    function unFlag(notice) {
        notice.flagged.is_flagged = false;
        notice.flagged.info = '';
        notice.flagged.by = '';

        axios.post(`${server}notices/update/${notice._id}`, notice)
            .then(res => console.log(res.data));

        forceUpdate();
    }

    return (
        <>
            <Card className='mb-2'>
                <CardContent>
                    <Typography variant="h4" component="div">
                        User Info
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <EmailIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={user.email}
                                secondary='E-mail'
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <BadgeIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={user.role}
                                secondary='Role'
                            />
                        </ListItem>
                    </List>


                </CardContent>

            </Card>
            <Card className='mb-2'>
                <CardContent>
                    <Typography variant="h4" component="div">
                        Your Notices
                    </Typography>

                    {
                        notices && notices.map(notice => {
                            return (
                                <div>
                                    {user !== undefined && (
                                        user.email === notice.author && (
                                            <>

                                                <Card className='mb-2'>
                                                    <CardContent>
                                                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                            Category: {notice.category}
                                                        </Typography>
                                                        <Typography variant="h6" component="div">
                                                            {notice.title}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            {notice.flagged.is_flagged && (
                                                                <span>{notice.flagged.info}</span>
                                                            )}

                                                            {!notice.flagged.is_flagged && (
                                                                <p>{notice.text}</p>
                                                            )}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardActions>
                                                        {user !== undefined && (
                                                            <>
                                                                <br />
                                                                {user.email === notice.author && (user.role === 'student_leader' || user.role === 'faculty') && (
                                                                    <Button size="small" to={"/edit/" + notice._id} component={Link}>Edit</Button>
                                                                )}
                                                            </>
                                                        )}
                                                    </CardActions>
                                                </Card>
                                            </>
                                        )
                                    )}
                                </div>
                            )
                        })
                    }
                </CardContent>
            </Card>
            {user !== undefined && (
                <>
                    {user.role === 'faculty' && (
                        <>
                            <Card className='mb-2'>
                                <CardContent>
                                    <Typography variant="h4" component="div">
                                        Notices Flagged By You
                                    </Typography>
                                    {
                                        notices && notices.map(notice => {
                                            return (
                                                <div>

                                                    {user.email === notice.flagged.by && (
                                                        <>
                                                            <Card className='mb-2'>
                                                                <CardContent>
                                                                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                                        Category: {notice.category}
                                                                    </Typography>
                                                                    <Typography variant="h6" component="div">
                                                                        {notice.title}
                                                                    </Typography>
                                                                    <Typography variant="body2">
                                                                        {notice.flagged.is_flagged && (
                                                                            <span>{notice.flagged.info}</span>
                                                                        )}

                                                                        {!notice.flagged.is_flagged && (
                                                                            <p>{notice.text}</p>
                                                                        )}
                                                                    </Typography>
                                                                </CardContent>
                                                                <CardActions>
                                                                    <Button size="small" onClick={() => unFlag(notice)} color='error'>Remove Flag</Button>
                                                                </CardActions>
                                                            </Card>
                                                        </>
                                                    )}
                                                </div>
                                            )
                                        })
                                    }

                                </CardContent>
                            </Card>


                        </>
                    )}
                </>

            )}
        </>
    );
}

export default Profile;