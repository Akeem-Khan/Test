import express from 'express';
import { register, accountActivation, login, logout, loggedIn, update, confirm, getAll, getUser,getAllStudents,
    getAllFaculty } from '../controllers/user.controller';

const router = express.Router();

router.post('/', register);
router.post('/login', login);
router.post('/account-activation', accountActivation)
router.get('/logout', logout);
router.get('/loggedin', loggedIn);
router.post('/update/:id', update);
router.get('/confirm', confirm);
router.get('/all', getAll);
router.get('/allStudents', getAllStudents);
router.get('/allFaculty', getAllFaculty);
router.get('/:id', getUser);

export default router;
