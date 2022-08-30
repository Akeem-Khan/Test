import {
    Paper,
    Button,
    Dialog,
    DialogTitle,
} from '@mui/material';
import * as React from 'react';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
    Conversation,
    ConversationList
} from '@chatscope/chat-ui-kit-react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

function DeleteChatDialog(props) {
    const { onClose, selectedValue, open, chats } = props;

    const handleClose = (chat) => {
        if(chat){
            onClose(chat);
        }
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };
    const theme = createTheme();



    return (
        <ThemeProvider onClose={handleClose} theme={theme}>
            <Dialog open={open}>
                <DialogTitle>Delete Chat</DialogTitle>
                <ConversationList>

                    {
                        chats && chats.map(chat => {
                            return (

                                <Conversation name={chat.otherUser.name} key={chat._id}>
                                    <Conversation.Operations visible>
                                        <IconButton aria-label="delete" color='error' onClick={() => handleClose(chat)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Conversation.Operations>
                                </Conversation>
                            )
                        })
                    }
                </ConversationList>
            </Dialog>
        </ThemeProvider >

    );

}


export default DeleteChatDialog;