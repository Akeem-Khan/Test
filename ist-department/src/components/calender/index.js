import React from 'react';
import { Component } from "react";
import { styled } from '@mui/material/styles';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import { ViewState, EditingState } from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    Toolbar,
    DateNavigator,
    MonthView,
    WeekView,
    ViewSwitcher,
    Appointments,
    AppointmentTooltip,
    AppointmentForm,
    DragDropProvider,
    EditRecurrenceMenu,
    AllDayPanel,
} from '@devexpress/dx-react-scheduler-material-ui';
import { connectProps } from '@devexpress/dx-react-core';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import LocationOn from '@mui/icons-material/LocationOn';
import Notes from '@mui/icons-material/Notes';
import Close from '@mui/icons-material/Close';
import CalendarToday from '@mui/icons-material/CalendarToday';
import Create from '@mui/icons-material/Create';
import AppointmentFormContainerBasic from './appointmentForm';
import AuthContext from "../../context/auth.context";

const server = process.env.REACT_APP_API;

const appointments = [
    {
      title: 'Website Re-Design Plan',
      startDate: new Date(2018, 6, 23, 9, 30),
      endDate: new Date(2018, 6, 23, 11, 30),
    }, {
      title: 'Book Flights to San Fran for Sales Trip',
      startDate: new Date(2018, 6, 23, 12, 0),
      endDate: new Date(2018, 6, 23, 13, 0),
    }
]
const PREFIX = 'Demo';
const classes = {
  content: `${PREFIX}-content`,
  header: `${PREFIX}-header`,
  closeButton: `${PREFIX}-closeButton`,
  buttonGroup: `${PREFIX}-buttonGroup`,
  button: `${PREFIX}-button`,
  picker: `${PREFIX}-picker`,
  wrapper: `${PREFIX}-wrapper`,
  icon: `${PREFIX}-icon`,
  textField: `${PREFIX}-textField`,
  addButton: `${PREFIX}-addButton`,
};

const StyledFab = styled(Fab)(({ theme }) => ({
    [`&.${classes.addButton}`]: {
      position: 'absolute',
      bottom: theme.spacing(3),
      right: theme.spacing(4),
    },
  }));

class Calendar extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
          user: null,
          data: appointments,
          currentDate: new Date(),
          confirmationVisible: false,
          editingFormVisible: false,
          deletedAppointmentId: undefined,
          editingAppointment: undefined,
          previousAppointment: undefined,
          addedAppointment: {},
          startDayHour: 9,
          endDayHour: 19,
          isNewAppointment: false,
        };

        this.currentDateChange = (currentDate) => {
          this.setState({ currentDate });
        };
    
        this.toggleConfirmationVisible = this.toggleConfirmationVisible.bind(this);
        this.commitDeletedAppointment = this.commitDeletedAppointment.bind(this);
        this.toggleEditingFormVisibility = this.toggleEditingFormVisibility.bind(this);
    
        this.fetchForAppointments = this.fetchForAppointments.bind(this);
        this.commitChanges = this.commitChanges.bind(this);
        this.onEditingAppointmentChange = this.onEditingAppointmentChange.bind(this);
        this.onAddedAppointmentChange = this.onAddedAppointmentChange.bind(this);
        this.appointmentForm = connectProps(AppointmentFormContainerBasic, () => {
          const {
            editingFormVisible,
            editingAppointment,
            data,
            addedAppointment,
            isNewAppointment,
            previousAppointment,
          } = this.state;
          const currentAppointment = data
          .filter(appointment => editingAppointment && appointment._id === editingAppointment._id)[0]
          || addedAppointment;
        const cancelAppointment = () => {
          if (isNewAppointment) {
            this.setState({
              editingAppointment: previousAppointment,
              isNewAppointment: false,
            });
          }
        };
  
        return {
          visible: editingFormVisible,
          appointmentData: currentAppointment,
          commitChanges: this.commitChanges,
          visibleChange: this.toggleEditingFormVisibility,
          onEditingAppointmentChange: this.onEditingAppointmentChange,
          cancelAppointment,
        };
      });
    }

  componentDidMount(){
    
    this.fetchForAppointments();
   
    
    }

    componentDidUpdate() {
     
      
        this.appointmentForm.update();
      }

      async fetchForAppointments(){
        const { user } = this.context 
        try{
          if(user.role === 'faculty'){
            const appointments = await axios.get(`${server}appointment/getAllFacultyAppointments/${user.id}`)
            const result = appointments.data.result.map((appt)=>{
              if(appt.isAdvisement){
                if(appt.advisementFor){

                  console.log(appt)
                  appt.title = appt.advisementFor.name + '- Advisement'
                } else {
                  appt.title = 'Advisement Slot'

                }
              }
              return appt;
            })
            console.log(result);
               this.setState({
                  user: user,
                  data: result
              });
          } else {
            const appointments = await axios.get(`${server}appointment/getAllAppointmentByOwner/${user.id}`);
            console.log(appointments);
            this.setState({
              user: user,
                data: appointments.data.result
            });
          }
         console.log('Component did mount')
  
      } catch (err) {
        console.log(err)
      }
      }
    
      onEditingAppointmentChange(editingAppointment) {
        this.setState({ editingAppointment });
      }
    
      onAddedAppointmentChange(addedAppointment) {
        this.setState({ addedAppointment });
        const { editingAppointment } = this.state;
        if (editingAppointment !== undefined) {
          this.setState({
            previousAppointment: editingAppointment,
          });
        }
        this.setState({ editingAppointment: undefined, isNewAppointment: true });
      }
    
      setDeletedAppointmentId(id) {
        this.setState({ deletedAppointmentId: id });
      }
    
      toggleEditingFormVisibility() {
        const { editingFormVisible } = this.state;
        this.setState({
          editingFormVisible: !editingFormVisible,
        });
      }
    
      toggleConfirmationVisible() {
        const { confirmationVisible } = this.state;
        this.setState({ confirmationVisible: !confirmationVisible });
      }
    
     async commitDeletedAppointment() {
       try{
        const {  deletedAppointmentId } = this.state;  
         const result = await axios.delete(`${server}appointment/deleteAppointment/${deletedAppointmentId}`)
         console.log(result);
         } catch (err) {
             console.log('an Error occured', err)

         }
         this.setState((state) => {
          const { data, deletedAppointmentId } = state;
          const nextData = data.filter(appointment => appointment._id !== deletedAppointmentId);
    
          return { data: nextData, deletedAppointmentId: null };
        }, ()=>
        this.toggleConfirmationVisible()
        );
      }
    
     async commitChanges({ added, changed, deleted }) {
        this.setState((state) => {
          let { data,deletedAppointmentId, confirmationVisible } = state;
          
          if (changed) {
            data = data.map(appointment => (
              changed[appointment._id] ? { ...appointment, ...changed[appointment._id] } : appointment));
          }
          if (deleted !== undefined) {
           
           deletedAppointmentId = deleted;
           
            confirmationVisible = !confirmationVisible
          }
          return { data, addedAppointment: {}, confirmationVisible, deletedAppointmentId };
        } 
        );

        console.log(added,changed,deleted,'LINE 227')
        
        if(added){
            try{
                added.owner = this.state.user.id;
                const result = await axios.post(`${server}appointment/create`, added)
                this.setState((state)=>{
                    let {data} = state;
                    const startingAddedId = data.length > 0 ? data[data.length - 1]._id + 1 : 0;
            data = [...data, result.data.result];
            return { data, addedAppointment: {} };
                })
                console.log(result);
               } catch (err) {
                   console.log('an Error occured', err)
    
               }
        }
        if(changed){
            try{
                const _id = Object.keys(changed)[0];
                const result = await axios.put(`${server}appointment/updateAppointment`, changed[_id])
                console.log(result);
               } catch (err) {
                   console.log('an Error occured', err)
    
               }
            }
        if(deleted){
       

        }
      }
    

  render() {
    const {
        currentDate,
        data,
        confirmationVisible,
        editingFormVisible,
        startDayHour,
        endDayHour,
      } = this.state;
  
      return (
        <Paper>
          <Scheduler
            data={data}
            height={660}
          >
            <ViewState
              currentDate={currentDate}
              onCurrentDateChange={this.currentDateChange}
            />
            <EditingState
              onCommitChanges={this.commitChanges}
              onEditingAppointmentChange={this.onEditingAppointmentChange}
              onAddedAppointmentChange={this.onAddedAppointmentChange}
              
            />
            <WeekView
              startDayHour={startDayHour}
              endDayHour={endDayHour}
            />
            <MonthView />
            <AllDayPanel />
            <EditRecurrenceMenu />
            <Appointments />
            <AppointmentTooltip
              showOpenButton
              showCloseButton
              
            />
            <Toolbar />
            <DateNavigator />
            <ViewSwitcher />
            <AppointmentForm
              overlayComponent={this.appointmentForm}
              visible={editingFormVisible}
              onVisibilityChange={this.toggleEditingFormVisibility}
            />
            <DragDropProvider />
          </Scheduler>
  
          <Dialog
            open={confirmationVisible}
            onClose={this.cancelDelete}
          >
            <DialogTitle>
              Delete Appointment
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this appointment?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.toggleConfirmationVisible} color="primary" variant="outlined">
                Cancel
              </Button>
              <Button onClick={this.commitDeletedAppointment} color="secondary" variant="outlined">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
  
          <StyledFab
            color="secondary"
            className={classes.addButton}
            onClick={() => {
              this.setState({ editingFormVisible: true });
              this.onEditingAppointmentChange(undefined);
              this.onAddedAppointmentChange({
                startDate: new Date(currentDate).setHours(startDayHour),
                endDate: new Date(currentDate).setHours(startDayHour + 1),
              });
            }}
          >
            <AddIcon />
          </StyledFab>
        </Paper>
      );
    
  }
}

export default Calendar;
