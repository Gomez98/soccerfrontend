import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useQuery, gql, useMutation } from '@apollo/client';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import RegistrationTable from '../components/RegistrationTable'


const GET_STUDENTS = gql`
query AllStudents{
    allStudents(search:{}){
        id
        fullName
        dni
    }
  }
`;

const ADD_REGISTRATION = gql`
mutation AddRegistration($registration:RegistrationInput){
    addRegistration(registration:$registration){
      workshopName
      schedule
      student{dni, fullName, id}
    }
  }
`;

const GET_WORKSHOPS = gql`
query AllWorkshop{
    allWorkshops(search:{}){
      id
      name
      schedule
    }
  }
`;


const Registration = () => {

    const navigate = useNavigate();
    const [tabValue, setTabValue] = React.useState('all');
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [schedules, setSchedules] = React.useState([]);
    const [selectedStudent, setSelectedStudent] = React.useState('');
    const [selectedStudentError, setSelectedStudentError] = React.useState('');
    const [selectedWorkshop, setSelectedWorkshop] = React.useState('');
    const [selectedSchedule, setSelectedSchedule] = React.useState('');


    const { loading: studentLoading, data: studentData } = useQuery(GET_STUDENTS);
    const [submitRegistration] = useMutation(ADD_REGISTRATION);
    const { loading: workshopLoading, data: workshopData } = useQuery(GET_WORKSHOPS);

    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue)
    }

    const handleSelectedStudent = (event, value) => {

        setSelectedStudent(value);
    };

    const handleSelectedWorkshop = (event) => {
        setSelectedWorkshop(event.target.value);
        setSchedules(event.target.value.schedule)
    };

    const handleSelectedSchedule = (event) => {
        setSelectedSchedule(event.target.value);
    };


    const handleSubmit = () => {
        if (!selectedStudent) {
            setSelectedStudentError('El nombre del estudiante es obligatorio');
            return;
        }
        submitRegistration({
            variables: {
                registration: { student: { id: selectedStudent.id, fullName: selectedStudent.fullName, dni: selectedStudent.dni }, workshopName: selectedWorkshop.name, schedule: selectedSchedule}
            }
        }).then(() => {
            setOpenSnackbar(true);
            setSnackbarMessage('Estudiante matriculado satisfactoriamente');
            setTimeout(() => {
                setSelectedStudent('')
                setSelectedWorkshop('')
                setSelectedSchedule('')
                navigate('/payment');
            }, 1000);
        }).catch((error) => {
            setOpenSnackbar(true);
            setSnackbarMessage('Error al matricular el estudiante');
        });
    }

    if (studentLoading) {
        return (
            <Box sx={{ width: '100%' }}>
                <LinearProgress />
            </Box>)
    }
    if (workshopLoading) {
        return (
            <Box sx={{ width: '100%' }}>
                <LinearProgress />
            </Box>)
    }
    
    return (
        <Container component="main">
            <Box sx={{ width: '100%', bgcolor: 'background.paper', mt: 10, mb: 5 }}>
                <Tabs value={tabValue} onChange={handleChangeTab} centered>
                    <Tab value="all" label="Todos" />
                    <Tab value="create" label="Registrar Matricula" />
                </Tabs>
            </Box>
            {tabValue === 'all' && (
                <RegistrationTable tabValue={tabValue}/>
            )}
            {(tabValue == "create") && (
                <Box sx={{ width: '300px', margin: 'auto', mt: 10, mb: 5 }}>
                    {studentData ? (
                        <Autocomplete
                            id="demo-simple-select"
                            sx={{ mb: 2 }}
                            options={studentData.allStudents || []}
                            getOptionLabel={(option) => option.fullName ? option.fullName : ''}
                            value={selectedStudent}
                            onChange={handleSelectedStudent}
                            renderInput={(params) => (
                                <TextField {...params} label="Estudiante" error={Boolean(selectedStudentError)} helperText={selectedStudentError}/>
                            )}
                            renderOption={(props, option) => (
                                <li {...props} key={option.id}>
                                    <TextField
                                        sx={{ "& fieldset": { border: "none" } }}
                                        value={option.fullName ? option.fullName : ''}
                                    />
                                </li>
                            )}
                        />
                    ) : (
                        <div>Loading students...</div>
                    )}

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="demo-simple-select-label" >Taller</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectedWorkshop}
                            label="Taller"
                            onChange={handleSelectedWorkshop}
                        >
                            {workshopData.allWorkshops.map(workshop => {
                                return (
                                    <MenuItem key={workshop.id} value={workshop} >{workshop.name}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>

                    {selectedWorkshop && (
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="demo-simple-select-schedule-label">Horario</InputLabel>
                            <Select
                                labelId="demo-simple-select-schedule-label"
                                id="demo-simple-select-schedule"
                                value={selectedSchedule}
                                label="Horario"
                                onChange={handleSelectedSchedule}
                            >
                                {schedules.map((schedule) => (
                                    <MenuItem key={schedule.id} value={schedule}>
                                        {schedule}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                    <Button fullWidth sx={{ mb: 2 }} type="submit" variant="contained" onClick={handleSubmit}>Registrar</Button>
                </Box>
            )}
            {openSnackbar && (<Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity="info" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>)}
        </Container>
    )
};

export default Registration;