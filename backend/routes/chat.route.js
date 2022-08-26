import express from 'express';
import { add, getUserChats} from '../controllers/chat.controller'

const router = express.Router();


router.post('/add', add);
router.get('/all/user/:id', getUserChats);


export default router;
