
const Chat = require("../models/chat.model");
const User = require("../models/user.model");


const getOtherUsers = (chats, id) => {
    let results = []
    for (let i = 0; i < chats.length; i++) {
        let chat = chats[i];
        let otherUserId = ''
        chat.users.forEach(uid => {
            if (uid != id) {
                otherUserId = uid
            }
        })
        chat.otherUserId = otherUserId
        results.push(chat)
    }

    return results
}


const add = (req, res) => {
    let chat = new Chat(req.body);
    chat.save()
        .then(chat => {
            res.status(200).json({ 'chat': 'Chat added successfully' });
        })
        .catch(err => {
            res.status(400).send('Error adding a new Chat');
        });
};


const getUserChats = (req, res) => {
    Chat.find((err, chats) => {
        if (err) {
            console.log(err);
        } else {
            chats = chats.filter(chat => {
                return chat.users.includes(req.params.id)
            })

            let updatedChats = getOtherUsers(chats, req.params.id)
            res.json(updatedChats)

        }
    });
};



const getChats = (req, res) => {
    Chat.find((err, chats) => {
        if (err) {
            console.log(err);
        } else {
            res.json(chats)
        }
    });
};

export { add, getUserChats, getChats };