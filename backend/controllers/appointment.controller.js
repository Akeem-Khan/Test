const AppointmentModel =  require('../models/appointment.model');
const UserModel = require('../models/user.model')
const sgMail = require('@sendgrid/mail')
const format = require('date-fns/format')

const createAppointment = async (req, res) => {
    const appointment = req.body;
    try {
     const result = await new AppointmentModel(appointment).save()
     res.status(200).json({result: result, message: 'Appointment has been created'});
    } catch (err) {
        res.status(400).send(err.message);
    }
}

const getAppointment = async (req,res) => {
   try {
    const result = await AppointmentModel.findById(req.params.id);
    res.status(200).json({result: result, message: 'Appointment retrieved succesfully'});
   } catch (err) {
     res.status(400).send(err.message);
   }
}

const getAllFacultyAdvisements = async (req, res) => {
    try {
     const result = await AppointmentModel.find({isAdvisement: true}).populate('owner').exec()
     res.status(200).json({result: result, message: 'All advisements retrieved successfully'});
    } catch (err) {
 res.status(400).send(err.message);
    }
}

const getAllFacultyAppointments = async (req, res) => {
    try {
     const result = await AppointmentModel.find({}).populate('advisementFor owner').exec()
     const allFaculty = result.filter((item)=>item.owner.role == 'faculty')
     res.status(200).json({result: allFaculty, message: 'All user appointments retrieved successfully'});
    } catch (err) {
 res.status(400).send(err.message);
    }
}

const getAllAppointmentByOwner = async (req, res) => {
    try {
     const result = await AppointmentModel.find({owner: req.params.userId})
     res.status(200).json({result: result, message: 'All user appointments retrieved successfully'});
    } catch (err) {
 res.status(400).send(err.message);
    }
}

const updateAppointment = async (req, res) => {
    try {
       const result = await AppointmentModel.findByIdAndUpdate(req.body._id, req.body);
       res.status(200).json({result: result, message: 'Appointment updated successfully'});

    } catch (err) {
        res.status(400).send(err.message);
    }
}

const deleteAppointment = async (req, res) => {
    try {
        const result = await AppointmentModel.findByIdAndDelete(req.params.id);
        res.status(200).json({result: result, message: 'Appointment deleted succesfully'});
    } catch(err) {
        res.status(400).send(err.message);
    }
}

const confirmBooking = async (req, res) => {
    try{
       const newStudentAdvisment = await AppointmentModel(req.body.booking).save();
       const updatedBooking = await AppointmentModel.findByIdAndUpdate(req.body.advisement._id, req.body.advisement)
      
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        const msg = {
        to: [req.body.student.email, req.body.faculty.email, 'itec445.react@gmail.com'], // Change to your recipient
        from: 'jamal.emmanuel@hotmail.com', // Change to your verified sender
        subject: 'Advisement Booking Confirmation',
        text: `Advisement has been booked with ${req.body.faculty.name} for ${req.body.student.name} at ${req.body.booking.startDate}.`,
        html: `<strong>Advisement has been booked with ${req.body.faculty.name} for ${req.body.student.name} at ${format(new Date(req.body.booking.startDate), 'MMM d yyyy - h:mm aaaa')}.</strong>`,
        }
        await sgMail.send(msg)
        res.status(200).json({result: newStudentAdvisment, message: 'Advisement Booked successfully'});
        
      

    }catch(err){
        res.status(400).send(err.message)
    }
}

module.exports = {
    createAppointment,
    getAppointment,
    getAllFacultyAppointments,
    getAllFacultyAdvisements,
    getAllAppointmentByOwner,
    updateAppointment,
    deleteAppointment,
    confirmBooking
}