import React, { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from "../../context/auth.context";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Input from '@mui/material/Input';

import { addSlash } from '../../helpers/tools';
const server = addSlash(process.env.REACT_APP_API);

function CreateNotice() {
    const { user } = useContext(AuthContext);

    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [category, setCategory] = useState("");
    const [author, setAuthor] = useState(user.email);
    const theme = createTheme();
    const categories = ["BSc Computer Information Systems", "BSc Information and Library Science", "BSc Information Technology", "BSc Internet Technology", "BSc Networking",
    "AAS Information Systems Development", "AAS Internet Technology", "AAS Library and Information Studies", "AAS Operating Systems Management", "CISCO Certified Network Associate - CCNA",
    "Certificate in Records Management", "Certificate in Records Management for the Public Sector"
]
    async function submit(e) {
        e.preventDefault();

        const newNotice = {
            title,
            text,
            category,
            author,
            flagged: {
                is_flagged: false,
                info: '',
                by: ''
            }
        };

        await axios.post(`${server}notices/add`, newNotice);

        setTitle("");
        setText("");
        setCategory("");
    }

    return (
        <ThemeProvider theme={theme}>
            <Card className='mb-2'>
                <CardContent>
                    <Typography variant="h4" component="div">
                        Create Notice
                    </Typography>

                    <form>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="title"
                            label="Title"
                            name="title"
                            autoFocus
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="text"
                            label="Text"
                            name="text"
                            autoFocus
                            onChange={(e) => setText(e.target.value)}
                            value={text}
                        />

                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                id="category"
                                value={category}
                                label="Category"
                                onChange={(e) => setCategory(e.target.value)}
                            >

                                {categories.map(category => {
                                    return (
                                        <MenuItem value={category} key={category}>{category}</MenuItem>)
                                })}
                            </Select>
                        </FormControl>

                    </form>


                    <CardActions>
                        <Button onClick={submit}>Submit</Button>
                    </CardActions>
                </CardContent>
            </Card>
        </ThemeProvider>
    )
}

export default CreateNotice;