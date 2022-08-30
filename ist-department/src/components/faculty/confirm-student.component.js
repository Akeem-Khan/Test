import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';

import AuthContext from "../../context/auth.context";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import { stripSlash } from '../../helpers/tools';
const server = stripSlash(process.env.REACT_APP_API);

function useForceUpdate() {
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}

function UserList() {
    const { user } = useContext(AuthContext);
    const [students, setStudents] = useState([]);
    const forceUpdate = useForceUpdate();

    useEffect(() => {
        axios.get(`${server}/auth/confirm`)
            .then(res => {
                setStudents(res.data);
            })
            .catch(function (err) {
                console.log(err);
            })
    }, []);

    function approve(id) {
        const role = {
            role: 'student_leader'
        };

        axios.post(`${server}/auth/update/${id}`, role)
            .catch(err => {
                console.log(err);
                return;
            });


        let stu = students;
        let index = stu.findIndex(s => s._id === id);
        stu[index].role = role.role;

        setStudents(stu);
        forceUpdate();
    }

    function revoke(id) {
        const role = {
            role: 'pending'
        };

        axios.post(`${server}/auth/update/${id}`, role)
            .catch(err => {
                console.log(err);
                return;
            });


        let stu = students;
        let index = stu.findIndex(s => s._id === id);
        stu[index].role = role.role;

        setStudents(stu);
        forceUpdate();
    }

    return (
        <div>
            <h3>Confirm Student Leaders</h3>
            <List>

                {
                    students && students.map(student => {
                        return (
                            <>
                                {student.role === 'pending' && (
                                    <ListItem
                                        key={student._id}
                                        secondaryAction={
                                            <IconButton edge="end" aria-label="Approve" onClick={() => approve(student._id)}>
                                                <CheckIcon />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemText
                                            primary={student.email}
                                            secondary={student.name + " - " + student.role}
                                        />
                                    </ListItem>
                                )}


                                {
                                    student.role === 'student_leader' && (
                                        <ListItem
                                            key={student._id}
                                            secondaryAction={
                                                <IconButton edge="end" aria-label="Approve" onClick={() => revoke(student._id)}>
                                                    <CloseIcon />
                                                </IconButton>
                                            }
                                        >
                                            <ListItemText
                                                primary={student.email}
                                                secondary={student.name + " - " + student.role}
                                            />
                                        </ListItem>
                                    )
                                }
                            </>
                        )
                    })
                }
            </List>

        </div>
    )
}

export default UserList;