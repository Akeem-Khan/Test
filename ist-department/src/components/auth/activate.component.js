import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import jwt from 'jsonwebtoken';
import { useHistory } from "react-router-dom";
import AuthContext from "../../context/auth.context";

import { addSlash } from "../../helpers/tools";

const server = addSlash(process.env.REACT_APP_API);

const Activate = ({ match }) => {
    const [values, setValues] = useState({
        name: '',
        token: '',
        buttonText: 'Activate Account'
    });

    const history = useHistory();
    const { getUser } = useContext(AuthContext);

    const { name, token, buttonText} = values;

    useEffect(() => {
        let token = match.params.token;
        if (token) {
            let { name } = jwt.decode(token);
            setValues({ ...values, name, token });
        }
    }, []);

    const clickSubmit = (event) => {
        event.preventDefault();

        setValues({...values, buttonText:'Activating'});

        axios
            .post(`${server}auth/account-activation`, {
                token
            })
            .then((response) => {
                console.log('ACCOUNT ACTIVATION', response);
                getUser();
                setValues({...values, buttonText:'Activate Account'});
                history.push('/');
            })
            .catch((error) => {
                console.log('ACCOUNT ACTIVATION ERROR', error.response.data.error);
            });
    }

    return (
        <div>
            <h3>Hey {values.name}, Ready to activate your account?</h3>
            <div className="text-center">
                <button className="btn btn-primary" onClick={clickSubmit}>{buttonText}</button>
            </div>
        </div>
    )
}

export default Activate
