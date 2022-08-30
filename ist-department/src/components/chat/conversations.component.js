import {
    Avatar,
    Conversation,
    ConversationList


} from '@chatscope/chat-ui-kit-react';
import Toolbar from '@mui/material/Toolbar';


function Conversations() {


    return (

        <div className='container-fluid' style={{ height: '70vh' }}>
            <ConversationList>
                <Conversation name="Lilly" lastSenderName="Lilly" info="Yes i can do it for you">
                    <Avatar  name="Lilly" />
                </Conversation>

                <Conversation name="Joe" lastSenderName="Joe" info="Yes i can do it for you">
                    <Avatar  name="Joe" />
                </Conversation>

                <Conversation name="Emily" lastSenderName="Emily" info="Yes i can do it for you">
                    <Avatar name="Emily" />
                </Conversation>

                <Conversation name="Kai" lastSenderName="Kai" info="Yes i can do it for you">
                    <Avatar  name="Kai" />
                </Conversation>

                <Conversation name="Akane" lastSenderName="Akane" info="Yes i can do it for you">
                    <Avatar  name="Akane" />
                </Conversation>

                <Conversation name="Eliot" lastSenderName="Eliot" info="Yes i can do it for you">
                    <Avatar  name="Eliot" />
                </Conversation>

                <Conversation name="Zoe" lastSenderName="Zoe" info="Yes i can do it for you">
                    <Avatar  name="Zoe" />
                </Conversation>

                <Conversation name="Patrik" lastSenderName="Patrik" info="Yes i can do it for you">
                    <Avatar  name="Patrik" />
                </Conversation>

            </ConversationList>
            <Toolbar></Toolbar>
        </div>

    );
}



export default Conversations;


