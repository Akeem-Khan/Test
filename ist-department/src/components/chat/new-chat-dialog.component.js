import {
    Paper,
    Button,
    Dialog,
    DialogTitle,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Toolbar,
    Box,
    Avatar
} from '@mui/material';
import * as React from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';

function NewChatDialog(props) {
    const { onClose, selectedValue, open, users } = props;
    const [search, setSearch] = React.useState('');

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };
    const theme = createTheme();



    return (
        <ThemeProvider theme={theme}>
            <Dialog onClose={handleClose} open={open}>
                <DialogTitle>New Chat</DialogTitle>
                <TextField
                    margin="normal"
                    fullWidth
                    id="search"
                    label="Search"
                    name="search"
                    autoFocus
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                />
                <List>
                    {users.map((user) => {
                        return (
                            <div>

                                {(user.name.includes(search)) && (
                                    < ListItem button onClick={() => handleListItemClick(user)} key={user.email}>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <PersonIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={user.name} secondary={user.email} />
                                    </ListItem>
                                )}
                            </div>
                        )
                    })}


                </List>
            </Dialog>
        </ThemeProvider >

    );

}

NewChatDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    users: PropTypes.array.isRequired,
};

export default NewChatDialog;