import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import MenuItem from '@mui/material/MenuItem';
import format from 'date-fns/format'

const server = process.env.REACT_APP_API;

export default function FormDialog(props) {
  const [advisements, setAdvisements] = React.useState([]);
  const [advisors, setAdvisors] = React.useState([]);
  const [filteredAdvisements, setFilteredAdvisements] = React.useState([]);
  const [data, setData] = React.useState({advisor: '', time: ''});
  const {handleClose, open, user} = props;
  
  React.useEffect(()=>{
    if(!advisors.length){
        fetchData()
    }
  },[advisors])

  const fetchData = () =>{
    try{
        axios.get(`${server}appointment/getAllFacultyAdvisements`).then((results)=>
        setAdvisements(results.data.result)
        )
        axios.get(`${server}auth/allFaculty`).then((faculty)=>
        setAdvisors(faculty.data.result)
        )
        console.log('advisors', advisors)
        console.log('advisments', advisements)
    } catch(e){
        console.log(e);
    }
    }
  
  const filterAdvisments = ({target}) =>{
      const filtered = advisements.filter((advisement)=>advisement.owner._id == target.value && !advisement.isBooked)
      filtered.sort((a,b)=>new Date(a.startDate) - new Date(b.startDate))
      console.log(filtered)
      setFilteredAdvisements(filtered);
      setData({...data, advisor: target.value})
  }

  const selectAdvisement = ({target}) => {
    setData({...data, time: target.value})
  }
  

  const submitBooking = async () => {
      try{
        const booking = filteredAdvisements[parseInt(data.time)];
        console.log(booking);
        const studentBooking = {title: `Advisement with ${booking.owner.name}`,owner: user.id, startDate: booking.startDate, endDate: booking.endDate, location: booking.location,}
        const theData = {booking: studentBooking, advisement: {...booking, isBooked: true, advisementFor: user.id}, student: user, faculty: booking.owner}
     const confirmedBooking = await axios.post(`${server}appointment/confirmBooking`, theData )
     console.log(confirmedBooking)
     handleClose()
    } catch(e){
        console.log(e)
    }
  }

  return (
    
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Book Advisement</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To book an advisement, select the Advisor from the below list. You can then select one of the available time slots.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="advisor"
            label="Select Advisor"
            fullWidth
            variant="outlined"
            onChange={filterAdvisments}
            value={data.advisor}
            select
          >
            {advisors.map((advisor, index)=><MenuItem key={index} value={advisor._id}>{advisor.name}</MenuItem>)}
          </TextField>
          <br />
          {filteredAdvisements.length > 0 ?
          <TextField
          margin="dense"
          id="advisement"
          label="Select Advisement Slot"
          fullWidth
          variant="outlined"
          value={data.time}
          onChange={selectAdvisement}
          select
          >
            {filteredAdvisements.map((advisement, index)=><MenuItem key={index} value={index}>{format(new Date(advisement.startDate), 'MMM d yyyy - h:mm aaaa') }</MenuItem>)}
          </TextField>
          : data.advisor &&
          <div>No Advisement Slots Available</div>
          
        }
        
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={submitBooking}>Submit Booking</Button>
        </DialogActions>
      </Dialog>
   
  );
}
