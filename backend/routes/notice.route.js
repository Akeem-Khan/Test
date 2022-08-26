import express from 'express';
import { getAll, getOne, add, update, deleteOne } from '../controllers/notice.controller'

const router = express.Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/add', add);
router.post('/update/:id', update);
router.delete('/update/:id', deleteOne);

export default router;
