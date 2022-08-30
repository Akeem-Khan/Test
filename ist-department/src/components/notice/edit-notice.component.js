import React, { Component } from 'react';
import axios from 'axios';
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

import { stripSlash } from '../../helpers/tools';
const server = stripSlash(process.env.REACT_APP_API);

export default class EditNotice extends Component {

    constructor(props) {
        super(props);

        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.onChangeCategory = this.onChangeCategory.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.theme = createTheme();
        this.state = {
            title: '',
            text: '',
            category: '',
            author: '',
            flagged: {
                is_flagged: false,
                info: '',
                by: '',
            },
        }

        this.categories = ["BSc Computer Information Systems", "BSc Information and Library Science", "BSc Information Technology", "BSc Internet Technology", "BSc Networking",
            "AAS Information Systems Development", "AAS Internet Technology", "AAS Library and Information Studies", "AAS Operating Systems Management", "CISCO Certified Network Associate - CCNA",
            "Certificate in Records Management", "Certificate in Records Management for the Public Sector"
        ]


    }

    componentDidMount() {
        axios.get(`${server}/notices/${this.props.match.params.id}`)
            .then(response => {
                this.setState({
                    title: response.data.title,
                    text: response.data.text,
                    category: response.data.category,
                    author: response.data.author,
                    flagged: {
                        is_flagged: response.data.flagged.is_flagged,
                        info: response.data.flagged.info,
                        by: response.data.flagged.by,
                    },
                })
            })
            .catch(function (err) {
                console.log(err)
            })
        console.log(this.state)
    }

    onChangeTitle(e) {
        this.setState({
            title: e.target.value
        });
    }

    onChangeText(e) {
        this.setState({
            text: e.target.value
        });
    }

    onChangeCategory(e) {
        this.setState({
            category: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();
        const notice = {
            title: this.state.title,
            text: this.state.text,
            category: this.state.category,
            author: this.state.author,
            flagged: {
                is_flagged: this.state.flagged.is_flagged,
                info: this.state.flagged.info,
                by: this.state.flagged.by,
            },
        };

        axios.post(`${server}/notices/update/${this.props.match.params.id}`, notice)
            .then(res => console.log(res.data));
    }

    onDelete() {
        axios.delete(`${server}/notices/update/${this.props.match.params.id}`)
            .then(res => {
                console.log(res.data);
                this.props.history.push('/')
            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        return (
            <ThemeProvider theme={this.theme}>
                <Card className='mb-2'>
                    <CardContent>
                        <Typography variant="h4" component="div">
                            Update Notice
                        </Typography>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            Author: {this.state.author} -                         {this.state.flagged.is_flagged && (
                                <>
                                    Warning {this.state.flagged.info}, changes will be saved but not displayed.
                                </>
                            )}
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
                                onChange={this.onChangeTitle}
                                value={this.state.title}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="text"
                                label="Text"
                                name="text"
                                autoFocus
                                onChange={this.onChangeText}
                                value={this.state.text}
                            />

                            <FormControl fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    id="category"
                                    value={this.state.category}
                                    label="Category"
                                    onChange={this.onChangeCategory}
                                >

                                    {this.categories.map(category => {
                                        return (
                                            <MenuItem value={category} key={category}>{category}</MenuItem>)
                                    })}
                                </Select>
                            </FormControl>

                        </form>


                        <CardActions>
                            <Button onClick={this.onSubmit}>Submit</Button>
                            <Button onClick={this.onDelete} color='error'>Delete</Button>
                        </CardActions>
                    </CardContent>
                </Card>
            </ThemeProvider>
        );
    }
}