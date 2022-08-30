import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

const UsersContext = createContext();

function UsersContextProvider(props) {
    const [users, setUsers] = useState([]);
    
    async function getUsers() {
        const usersRes = await axios.get(`${process.env.REACT_APP_API}/auth/all`)
        setUsers(usersRes.data);
    }



    useEffect(() => {
        getUsers();
    }, []);

    return (
        <UsersContext.Provider value={{ users, getUsers }}>
            {props.children}
        </UsersContext.Provider>
    );
}

export default UsersContext;
export { UsersContextProvider };
