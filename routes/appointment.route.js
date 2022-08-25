import express from 'express';
import {createAppointment,
    getAppointment,
    getAllFacultyAppointments,
    getAllAppointmentByOwner,
    updateAppointment,
    deleteAppointment} from '../controllers/appointment.controller'
const router = express.Router();

router.post('/create',createAppointment);
router.get('/getAppointment/:id', getAppointment);
router.get('/getAllFacultyAppointments/:userId', getAllFacultyAppointments);
router.get('/getAllAppointmentByOwner/:userId', getAllAppointmentByOwner);
router.put('/updateAppointment', updateAppointment);
router.delete('/deleteAppointment/:id', deleteAppointment);

export default router;