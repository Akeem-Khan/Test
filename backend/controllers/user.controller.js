const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

import { sendEmailWithNodemailer } from "../helpers/email.helper";

// register

const register = async (req, res) => {
    try {
        const { name, email, password, passwordVerify, role } = req.body;

        // validation

        if (!name || !email || !password || !passwordVerify || !role)
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });

        if (password !== passwordVerify)
            return res.status(400).json({
                errorMessage: "Passwords did not match.",
            });

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({
                errorMessage: "An account with this email already exists.",
            });


        // hash the password

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const token = jwt.sign({
            name,
            email,
            passwordHash,
            role
        },
            process.env.JWT_ACCOUNT_ACTIVATION
        );

        const emailData = {
            to: email,
            subject: "ACCOUNT ACTIVATION LINK",
            html: `
                      <h1>Please use the following link to activate your account</h1>
                      <p>http://localhost:3000/activate/${token}</p>
                      <hr />
                      <p>This email may contain sensitive information</p>
                      <p>http://localhost:3000</p>
                  `,
        };

        sendEmailWithNodemailer(req, res, emailData);

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
};




const accountActivation = (req, res) => {
    const { token } = req.body;

    if (token) {
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, async (err, decodedToken) => {
            if (err) {
                console.log('JWT account verification error', err);
                return res.status(401).json({
                    error: 'Expired Link.  Signup again'
                });

            }

            // const {name, email, passwordHash, role} = jwt.decode(token);
            const { name, email, passwordHash, role } = decodedToken;
            const user = new User({
                name: name,
                email: email,
                password: passwordHash,
                role: role
            });

            const savedUser = await user.save();

            const token = jwt.sign(
                {
                    user: savedUser._id,
                },
                process.env.JWT_SECRET
            );

            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            }).send();
        });

    }
    else {
        return res.json({
            message: 'something went wrong'
        })
    }

}





// log in

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // validate

        if (!email || !password)
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });

        const existingUser = await User.findOne({ email });
        if (!existingUser)
            return res.status(401).json({ errorMessage: "Wrong email or password." });

        const passwordCorrect = await bcrypt.compare(
            password,
            existingUser.password
        );
        if (!passwordCorrect)
            return res.status(401).json({ errorMessage: "Wrong email or password." });

        // sign the token

        const token = jwt.sign(
            {
                user: existingUser._id
            },
            process.env.JWT_SECRET
        );

        // send the token in a HTTP-only cookie

        res
            .cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            })
            .send();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
};

// logout

const logout = (req, res) => {
    res
        .cookie("token", "", {
            httpOnly: true,
            expires: new Date(0),
            secure: true,
            sameSite: "none",
        })
        .send();
};


const loggedIn = (req, res) => {
    const userRes = {
        loggedIn: false,
        id: '',
        name: '',
        email: '',
        role: ''
    }

    try {
        const token = req.cookies.token;

        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
                if (err) {
                    console.log(err.message);
                    return res.json(userRes);
                }
                else {
                    let user = await User.findById(decodedToken.user);

                    userRes.loggedIn = true;
                    userRes.id = user._id;
                    userRes.name = user.name;
                    userRes.email = user.email;
                    userRes.role = user.role;

                    return res.json(userRes);
                }
            });
        }
        else {
            return res.json(userRes);
        }
    } catch (err) {
        console.log(err.message);
        res.json(userRes);
    }
};


const update = async (req, res) => {
    const user = await User.findById(req.params.id)

    if (!user)
        res.status(404).send('User not found');
    else {
        user.role = req.body.role;
        await user.save();
        res.json(user);
    }
};

const getUser = async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!user)
        res.status(404).send('User not found');
    else {
        res.json(user);
    }
};

const confirm = (req, res) => {
    User.find(function (err, users) {
        if (err) {
            console.log(err);
        } else {
            res.json(users);
        }
    });
};

const getAll = (req, res) => {
    User.find(function (err, users) {
        if (err) {
            console.log(err);
        } else {
            res.json(users);
        }
    });
};

const getAllStudents = async (req, res) => {
    try{
    const students = await User.find({role: 'student'})
    res.status(200).json({result: students, message: 'All Students successfully retrieved'})
    } catch (err) {
    res.status(400).send(err.message)
    }
}

const getAllFaculty = async (req, res) => {
    try{
    const faculty = await User.find({role: 'faculty'})
    res.status(200).json({result: faculty, message: 'All faculty successfully retrieved'})
    } catch (err) {
    res.status(400).send(err.message)
    }
}




export { register, accountActivation, login, logout, loggedIn, update, confirm, getAll, getUser, getAllStudents,
    getAllFaculty };