const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");

import noticeRoutes from './routes/notice.route';
import userRoutes from './routes/user.route';
import chatRoutes from './routes/chat.route';
import chatModel from './models/chat.model';
import appointmentRoutes from './routes/appointment.route';

dotenv.config();

app.use(
    cors({
        origin: [
            process.env.CLIENT_URL,
        ],
        credentials: true,
    })
);

app.use(bodyParser.json());
app.use(cookieParser());

app.use('/notices', noticeRoutes);
app.use('/auth', userRoutes);
app.use('/chat', chatRoutes);
app.use('/appointment', appointmentRoutes);

module.exports = app;