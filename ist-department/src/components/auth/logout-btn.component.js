import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import AuthContext from "../../context/auth.context";

const server = process.env.REACT_APP_API;

function LogOutBtn() {
  const { getUser } = useContext(AuthContext);

  const history = useHistory();

  async function logOut() {
    await axios.get(`${server}auth/logout`);
    await getUser();
    history.push("/");
  }

  return <span className="nav-link" onClick={logOut} style={{color: "red", cursor: "pointer"}}>Log out</span>;
}

export default LogOutBtn;
