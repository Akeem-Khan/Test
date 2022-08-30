import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

import { stripSlash } from '../helpers/tools';
const server = stripSlash(process.env.REACT_APP_API);

const AuthContext = createContext();

function AuthContextProvider(props) {
    const [user, setUser] = useState(undefined);

    async function getUser() {
        const userRes = await axios.get(
            `${server}/auth/loggedIn`
        );
        setUser(userRes.data);
    }

    useEffect(() => {
        getUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, getUser }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };
