import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

function AuthContextProvider(props) {
    const [user, setUser] = useState(undefined);

    async function getUser() {
        const userRes = await axios.get(
            `${process.env.REACT_APP_API}/auth/loggedIn`
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
