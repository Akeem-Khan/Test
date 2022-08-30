import {
    ConversationHeader,
    Avatar,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    Conversation,
    ConversationList
} from '@chatscope/chat-ui-kit-react';
import {
    Paper,
    Button,
    Toolbar,
    Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AuthContext from "../../context/auth.context";
import UsersContext from '../../context/users.context';
import SocketContext from '../../context/socket.context';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import NewChatDialog from './new-chat-dialog.component';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteChatDialog from './delete-chat-dialog.component';
import Stack from '@mui/material/Stack';

import { addSlash } from '../../helpers/tools';
const server = addSlash(process.env.REACT_APP_API);


function Chat() {
    const [open, setOpen] = React.useState(false);
    const [deleteOpen, setDeleteOpen] = React.useState(false);

    const { user } = useContext(AuthContext);
    const [chats, setChats] = useState([]);
    const { users } = useContext(UsersContext);
    const { socket } = useContext(SocketContext);
    const [selectedChat, setSelectedChat] = useState(null);
    const [selectedValue, setSelectedValue] = useState(null);

    socket.on('message', record => {
        axios.get(`${server}chat/all/user/${user.id}`)
            .then(response => {
                let chats = getOtherUsers(response.data)
                setChats(chats);
                if (selectedChat) {
                    chats.forEach(chat => {
                        if (chat._id === selectedChat._id) {
                            setSelectedChat(chat)
                        }
                    })
                }

            })
            .catch(function (error) {
                console.log(error);
            })


    });


    const getOtherUsers = (chatList) => {
        let results = []
        for (let i = 0; i < chatList.length; i++) {
            let chat = chatList[i];
            let otherUserId = ''
            chat.users.forEach(uid => {
                if (uid != user.id) {
                    otherUserId = uid
                }
            })
            chat.otherUser = getUser(otherUserId)
            results.push(chat)
        }

        return results
    }


    const getUser = (id) => {
        return users.find((userData) => {
            return userData._id == id
        })
    }

    const handleSendMessage = (text) => {
        console.log(text)
        socket.emit('send-message', { selectedChat, text, sender: user.id, date: Date.now() });
    }

    const selectChat = (chat) => {
        setSelectedChat(chat)
    }
    const handleClickOpen = () => {
        console.log('open')
        setOpen(true);
    };

    const handleDeleteOpen = () => {
        setDeleteOpen(true);
        setSelectedChat(false);
    };

    const getChats = () => {


        axios.get(`${server}chat/all/user/${user.id}`)
            .then(response => {
                let chats = getOtherUsers(response.data)
                setChats(chats);
                console.log(chats)
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    useEffect(() => {
        const usersRes = axios.get(`${server}auth/all`).then(usersRes => {
        })


        getChats()
    }, []);


    const handleClose = async (value) => {
        setOpen(false);
        try {
            let newChat = { users: [user.id, value._id] }
            socket.emit('new-chat', newChat);
            getChats()
        } catch {

        }
    };

    const deleteChat = (value) => {
        setSelectedChat(false);
        setDeleteOpen(false);
        try {
            socket.emit('delete-chat', value);
            getChats()
        } catch {

        }
    };

    return (
        <div className='container-fluid' >
            <Card className='mb-2'>
                <CardContent>
                    <Typography variant="h4" component="div">
                        Chat
                    </Typography>
                    <div className="row">
                        <div className="col-4" >
                            <Paper elevation={1} style={{ height: '70vh' }}>
                                <Toolbar>
                                    <Stack direction="row" spacing={1}>
                                        <IconButton onClick={handleClickOpen} color='primary'>
                                            <AddIcon />
                                        </IconButton>
                                        <IconButton onClick={handleDeleteOpen} color='error'>
                                            <DeleteIcon />
                                        </IconButton>

                                    </Stack>                                </Toolbar>

                                <ConversationList>

                                    {
                                        chats && chats.map(chat => {
                                            return (

                                                <Conversation name={chat.otherUser.name} key={chat._id} onClick={() => selectChat(chat)}>
                                                </Conversation>
                                            )
                                        })
                                    }
                                </ConversationList>
                            </Paper>
                        </div>

                        <div className="col-8" >


                            <Paper elevation={1} style={{ height: '70vh' }}>
                                {
                                    selectedChat && (

                                        <ChatContainer>
                                            <ConversationHeader>
                                                <ConversationHeader.Content userName={selectedChat.otherUser.name} />
                                            </ConversationHeader>
                                            <MessageList >
                                                {
                                                    selectedChat.messages && selectedChat.messages.map(message => {
                                                        return (

                                                            <Message model={{
                                                                message: message.text,
                                                                direction: message.sender == user.id ? 'outgoing' : 'incoming',
                                                            }} key={message.date} />
                                                        )
                                                    })
                                                }





                                            </MessageList>
                                            <MessageInput placeholder="Type message here" onSend={handleSendMessage} attachButton={false} />
                                        </ChatContainer>
                                    )

                                }

                                {
                                    !selectedChat && (

                                        <Box sx={{ p: 3 }}>
                                            Select A Chat
                                        </Box>
                                    )

                                }

                            </Paper>
                        </div>
                    </div>
                </CardContent>

            </Card>

            <NewChatDialog
                open={open}
                users={users.filter((listUser) => {
                    return listUser._id != user.id
                })}
                onClose={handleClose}
            />
            <DeleteChatDialog
                open={deleteOpen}
                chats={chats}
                onClose={deleteChat}
            />

            <Toolbar></Toolbar>
        </div>

    );
}





export default Chat;