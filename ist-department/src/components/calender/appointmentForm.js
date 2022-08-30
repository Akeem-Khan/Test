import {Component} from 'react';
import { styled } from '@mui/material/styles';
import AuthContext from "../../context/auth.context";
import {
   
    AppointmentForm,
    
} from '@devexpress/dx-react-scheduler-material-ui';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import LocationOn from '@mui/icons-material/LocationOn';
import Notes from '@mui/icons-material/Notes';
import Close from '@mui/icons-material/Close';
import CalendarToday from '@mui/icons-material/CalendarToday';
import Create from '@mui/icons-material/Create';
import CheckBox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import add from 'date-fns/add';
import axios from 'axios';

import { stripSlash } from '../../helpers/tools';
const server = stripSlash(process.env.REACT_APP_API);

const PREFIX = 'Appointment';
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

const StyledDiv = styled('div')(({ theme }) => ({
    [`& .${classes.icon}`]: {
      margin: theme.spacing(2, 0),
      marginRight: theme.spacing(2),
    },
    [`& .${classes.header}`]: {
      overflow: 'hidden',
      paddingTop: theme.spacing(0.5),
    },
    [`& .${classes.textField}`]: {
      width: '100%',
    },
    [`& .${classes.content}`]: {
      padding: theme.spacing(2),
      paddingTop: 0,
    },
    [`& .${classes.closeButton}`]: {
      float: 'right',
    },
    [`& .${classes.picker}`]: {
      marginRight: theme.spacing(2),
      '&:last-child': {
        marginRight: 0,
      },
      width: '50%',
    },
    [`& .${classes.wrapper}`]: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(1, 0),
    },
    [`& .${classes.advisement}`]: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(1, 0),
      marginLeft: theme.spacing(2),
    },
    [`& .${classes.buttonGroup}`]: {
      display: 'flex',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 2),
    },
    [`& .${classes.button}`]: {
      marginLeft: theme.spacing(2),
    },
  }));

export default class AppointmentFormContainerBasic extends Component {
  static contextType = AuthContext;
    constructor(props) {
      super(props);
  
      this.state = {
        appointmentChanges: {},
        students: []
      };

      
  
      this.getAppointmentData = () => {
        const { appointmentData } = this.props;
        return appointmentData;
      };
      this.getAppointmentChanges = () => {
        const { appointmentChanges } = this.state;
        return appointmentChanges;
      };
  
      this.changeAppointment = this.changeAppointment.bind(this);
      this.commitAppointment = this.commitAppointment.bind(this);
    }

  async  componentDidMount(){
        try{
          const students = await axios.get(`${server}/auth/AllStudents`);
          this.setState({students: students.data.result})
        } catch(e){
          console.log(e)
        }           
    }
  
    changeAppointment({ field, changes }) {
      const nextChanges = {
        ...this.getAppointmentChanges(),
        [field]: changes,
      };
      this.setState({
        appointmentChanges: nextChanges,
      },()=> console.log(this.state));
    }
  
    commitAppointment(type) {
      const { commitChanges } = this.props;
      const appointment = {
        ...this.getAppointmentData(),
        ...this.getAppointmentChanges(),
      };
      if (type === 'deleted') {
        commitChanges({ [type]: appointment._id });
      } else if (type === 'changed') {
        commitChanges({ [type]: { [appointment._id]: appointment } });
      } else {
        commitChanges({ [type]: appointment });
      }
      this.setState({
        appointmentChanges: {},
      });
    }
  
    render() {
      const {
        visible,
        visibleChange,
        appointmentData,
        cancelAppointment,
        target,
        onHide,
      } = this.props;
      const { appointmentChanges, students } = this.state;
  
      const displayAppointmentData = {
        ...appointmentData,
        ...appointmentChanges,
      };
  
      const isNewAppointment = appointmentData._id === undefined;
      const applyChanges = isNewAppointment
        ? () => this.commitAppointment('added')
        : () => this.commitAppointment('changed');
  
      const textEditorProps = field => ({
        variant: 'outlined',
        onChange: ({ target: change }) => this.changeAppointment({
          field: [field], changes: change.value,
        }),
        value: displayAppointmentData[field] || '',
        label: field[0].toUpperCase() + field.slice(1),
        className: classes.textField,
      });

      const selectEditorProps = field => ({
       id: 'advisementFor',
        onChange: (event) =>{
          console.log(event.target.value)
          this.changeAppointment({
          field: [field], changes: event.target.value,
        })},
        value: displayAppointmentData[field] || '',
        label: 'Advisement For',
        className: classes.textField,
      });

      const advisementProps = () => ({
        checked: displayAppointmentData['isAdvisement']  || false,
        className: classes.advisement,
        onChange: ({target})=>{  
          const endDate = target.checked ? add(displayAppointmentData['startDate'], {minutes: 15}) : displayAppointmentData['endDate'];
          //this.changeAppointment({field: 'endDate', changes: endDate});
         // this.changeAppointment({ field: 'isAdvisement', changes: target.checked,});
          this.setState((state)=>{
            let {appointmentChanges} = state;
            appointmentChanges = {...appointmentChanges, 
              endDate : endDate,
              isAdvisement : target.checked,
            }
            return {appointmentChanges};
          }, ()=>console.log(this.state))
          
        },
      })
  
      const pickerEditorProps = field => ({
        // keyboard: true,
        value: displayAppointmentData[field],
        onChange: date => this.changeAppointment({
          field: [field], changes: date ? date.toDate() : new Date(displayAppointmentData[field]),
        }),
        ampm: false,
        inputFormat: 'DD/MM/YYYY HH:mm',
        onError: () => null,
      });
      const startDatePickerProps = pickerEditorProps('startDate');
      const endDatePickerProps = pickerEditorProps('endDate');
      const cancelChanges = () => {
        this.setState({
          appointmentChanges: {},
        });
        visibleChange();
        cancelAppointment();
      };
      const { user } = this.context
  
      return (
        <AppointmentForm.Overlay
          visible={visible}
          target={target}
          fullSize={false}
          onHide={onHide}
        >
          <StyledDiv>
            <div className={classes.header}>
              <IconButton className={classes.closeButton} onClick={cancelChanges} size="large">
                <Close color="action" />
              </IconButton>
            </div>
            <div className={classes.content}>
              <div className={classes.wrapper}>
                <Create className={classes.icon} color="action" />
                { displayAppointmentData['isAdvisement'] ?
                <>
                
                <TextField {...selectEditorProps('advisementFor')} select>
                  {students.map((student, index)=><MenuItem key={index} value={student._id}>{student.name}</MenuItem>)}
                </TextField>
                </>
              :
              
                <TextField
                {...textEditorProps('title')}
                />
              }

                
              </div>
              {user.role === 'faculty' &&
              <div className={classes.advisement}>
                <FormControlLabel control={
                  <CheckBox {...advisementProps()}  />} label='Advisement Slot' />

              </div>
                }

              <div className={classes.wrapper}>
                <CalendarToday className={classes.icon} color="action" />
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DateTimePicker
                    label="Start Date"
                    renderInput={
                      props => <TextField className={classes.picker} {...props} />
                    }
                    {...startDatePickerProps}
                    />
                  <DateTimePicker
                    label="End Date"
                    renderInput={
                      props => <TextField className={classes.picker} {...props} />
                    }
                    {...endDatePickerProps}
                    disabled={displayAppointmentData['isAdvisement'] || false}
                    
                  />
                </LocalizationProvider>
              </div>
              <div className={classes.wrapper}>
                <LocationOn className={classes.icon} color="action" />
                <TextField
                  {...textEditorProps('location')}
                />
              </div>
              <div className={classes.wrapper}>
                <Notes className={classes.icon} color="action" />
                <TextField
                  {...textEditorProps('notes')}
                  multiline
                  rows="6"
                />
              </div>
            </div>
            <div className={classes.buttonGroup}>
              {!isNewAppointment && (
                <Button
                  variant="outlined"
                  color="secondary"
                  className={classes.button}
                  onClick={() => {
                    visibleChange();
                    this.commitAppointment('deleted');
                  }}
                >
                  Delete
                </Button>
              )}
              <Button
                variant="outlined"
                color="primary"
                className={classes.button}
                onClick={() => {
                  visibleChange();
                  applyChanges();
                }}
              >
                {isNewAppointment ? 'Create' : 'Save'}
              </Button>
            </div>
          </StyledDiv>
        </AppointmentForm.Overlay>
      );
    }
  }
  