const AppointmentModel =  require('../models/appointment.model');
const UserModel = require('../models/user.model');

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

// const getAllFacultyAppointments = async (req, res) => {
//     try {
//     const owner = await UserModel.findById(req.params.userId);
//      const allAppointments = await AppointmentModel.find({}).populate('owner').exec();
//      const result = allAppointments.map((appointment)=>{
//         if(appointment.owner.role == owner.role) {
//             return appointment;
//         }
//      })
//      res.status(200).json({result: result, message: 'All Faculty Appointments retrieved successfully'})

//     } catch (err) {
//         res.status(400).send(err.message);
//     }
// }

const getAllFacultyAppointments = async (req, res) => {
    try {
     const result = await AppointmentModel.find({})
     res.status(200).json({result: result, message: 'All user appointments retrieved successfully'});
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

module.exports = {
    createAppointment,
    getAppointment,
    getAllFacultyAppointments,
    getAllAppointmentByOwner,
    updateAppointment,
    deleteAppointment
}