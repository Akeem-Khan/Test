import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from "../../context/auth.context";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const server = process.env.REACT_APP_API;


function useForceUpdate() {
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}


function NoticeList() {
    const { user } = useContext(AuthContext);
    const [notices, setNotices] = useState([]);
    const forceUpdate = useForceUpdate();


    useEffect(() => {
        axios.get(`${server}notices/`)
            .then(response => {
                setNotices(response.data);
            })
            .catch(function (error) {
                console.log(error);
            })
    }, []);


    function flag(notice) {
        notice.flagged.is_flagged = true;
        notice.flagged.info = `This post was removed by ${user.name}. You can contact this person with the following: ${user.email}`;
        notice.flagged.by = user.email;

        axios.post(`${server}notices/update/${notice._id}`, notice)
            .then(res => console.log(res.data));

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
        <div>
            <Card className='mb-2'>
                <CardContent>
                    <Typography variant="h4" component="div">
                        Notices {server}
                    </Typography>
                    {
                        notices && notices.map(notice => {
                            return (
                                <>
                                    <Card className='mb-2'>
                                        <CardContent>
                                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                Author: {notice.author} &nbsp; Category: {notice.category}
                                            </Typography>
                                            <Typography variant="h5" component="div">
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

                                                    {user.role === 'faculty' && user.email !== notice.author && (
                                                        <>

                                                            {notice.flagged.is_flagged && (
                                                                <Button size="small" onClick={() => unFlag(notice)}>Remove Flag</Button>
                                                            )}

                                                            {!notice.flagged.is_flagged && (
                                                                <Button size="small" onClick={() => flag(notice)} color="error">Flag</Button>
                                                            )}

                                                        </>

                                                    )}
                                                </>
                                            )}
                                        </CardActions>
                                    </Card>

                                </>
                            )
                        })
                    }
                </CardContent>

            </Card>

        </div>
    )
}

export default NoticeList;