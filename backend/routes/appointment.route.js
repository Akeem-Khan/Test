import express from 'express';
import {createAppointment,
    getAppointment,
    getAllFacultyAdvisements,
    getAllFacultyAppointments,
    getAllAppointmentByOwner,
    updateAppointment,
    confirmBooking,
    deleteAppointment} from '../controllers/appointment.controller'
const router = express.Router();

router.post('/create',createAppointment);
router.get('/getAppointment/:id', getAppointment);
router.get('/getAllFacultyAppointments/:userId', getAllFacultyAppointments);
router.get('/getAllFacultyAdvisements', getAllFacultyAdvisements);
router.get('/getAllAppointmentByOwner/:userId', getAllAppointmentByOwner);
router.post('/confirmBooking', confirmBooking);
router.put('/updateAppointment', updateAppointment);
router.delete('/deleteAppointment/:id', deleteAppointment);

export default router;