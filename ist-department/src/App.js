import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { AuthContextProvider } from "./context/auth.context";
import Router from "./Router";
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import socketClient from "socket.io-client";
import { UsersContextProvider } from "./context/users.context";
import { SocketContextProvider } from "./context/socket.context";

import { stripSlash } from './helpers/tools';

const dotenv = require('dotenv');
dotenv.config();

axios.defaults.withCredentials = true;

const SERVER = stripSlash(process.env.REACT_APP_API);
class App extends Component {

  render() {
    var socket = socketClient(SERVER);
    socket.on('connection', () => {
      console.log(`I'm connected with the back-end`);
    });
    return (
      <AuthContextProvider>
        <UsersContextProvider>
          <SocketContextProvider>

            <Router />
          </SocketContextProvider>

        </UsersContextProvider>
      </AuthContextProvider>
    );
  }
}
export default App;
