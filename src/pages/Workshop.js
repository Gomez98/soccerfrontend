import * as React from 'react';
import Box from '@mui/material/Box';
import { gql, useMutation } from '@apollo/client';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import WorkshopTable from '../components/WorkshopTable';


const ADD_WORKSHOP = gql`
mutation AddWorkshop($workshop:WorkshopInput){
    addWorkshop(workshop:$workshop){
      name
    }
  }
`;

const UPDATE_WORKSHOP = gql`
mutation UpdateWorkshop($workshop: WorkshopInput){
    updateWorkshop(workshop:$workshop){
      id
    }
  }
`;

const Workshop = ({onChangeWorkshop}) => {

    const navigate = useNavigate();
    const [tabValue, setTabValue] = React.useState('all');
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [schedule, setSchedule] = React.useState('');
    const [scheduleError, setScheduleError] = React.useState('');

    const [name, setName] = React.useState('');
    const [nameError, setNameError] = React.useState('');

    const [price, setPrice] = React.useState('');
    const [priceError, setPriceError] = React.useState('');

    const [submitWorkshop, { loading: submitLoading, error: submitError}] = useMutation(ADD_WORKSHOP);
    const [updateWorkshop, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_WORKSHOP);


    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue)
    }

    const handleChangeName = (event) => {
        if (event.target.value && event.target.value.trim() === '') {
            setNameError('El nombre es obligatorio');
        } else {
            setNameError('');
        }
        setName(event.target.value)

    }

    const handleChangeSchedule = (event) => {
        if (event.target.value && event.target.value.trim() === '') {
            setScheduleError('El horario es obligatorio');
        } else {
            setScheduleError('');
        }
        setSchedule(event.target.value.split(','))

    }

    const handleChangePrice = (event) => {
        if (event.target.value && event.target.value.trim() === '') {
            setPriceError('El precio es obligatorio');
        } else {
            setPriceError('');
        }
        setPrice(event.target.value)

    }

    const handleDelete = (workshop) => {
        handleUpdateWorkshop({ ...workshop, deleted: true});
    }

    const handleUpdateWorkshop = (selectedWorkshop) => {
        const { __typename, ...updatedWorkshop } = selectedWorkshop;
        updateWorkshop({
            variables: {workshop: updatedWorkshop}
        }).then(() => {
            setOpenSnackbar(true);
            setSnackbarMessage('Taller actualizado satisfactoriamente');
            setTimeout(() => {
                setTabValue('all')
            }, 2000);
        }).catch((error) => {
            setOpenSnackbar(true);
            setSnackbarMessage('Error al actualizar el taller');
        });
    }

    const handleEdit = (workshop) => {
        onChangeWorkshop(workshop)
        navigate('/workshop/edit/'+ workshop.id);
    }

    const handleSubmit = () => {
        if (!name) {
            setNameError('El nombre es obligatorio');
            return;
        }
        if (!schedule) {
            setScheduleError('El horario es obligatorio');
            return;
        }
        if (!price) {
            setPriceError('El precio es obligatorio');
            return;
        }
        submitWorkshop({
            variables: {
                workshop: { name, schedule, price }
            }
        }).then(() => {
            setOpenSnackbar(true);
            setSnackbarMessage('Taller registrado satisfactoriamente');
            setTimeout(() => {
                setName('')
                setSchedule([])
                setPrice('')
                setTabValue('all')
                navigate('/workshop');
            }, 1000);
        }).catch((error) => {
            setOpenSnackbar(true);
            setSnackbarMessage('Error al registrar el taller');
        });
    }


    if (submitLoading) {
        return (
            <Box sx={{ width: '100%' }}>
                <LinearProgress />
            </Box>)
    }

    if (updateLoading) {
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
                    <Tab value="create" label="Registrar Taller" />
                </Tabs>
            </Box>

            {tabValue === 'all' && (
                <WorkshopTable tabValue={tabValue} onDelete={handleDelete} onEdit={handleEdit}/>
            )}


            {(tabValue === "create") && (
                <Box sx={{ width: '300px', margin: 'auto'}}>
                    <TextField fullWidth sx={{ mb: 2 }} placeholder="Nombre" value={name} onChange={handleChangeName} error={Boolean(nameError)} helperText={nameError}/>
                    <TextField fullWidth sx={{ mb: 2 }} placeholder="Horarios" value={schedule && schedule.join(',')} onChange={handleChangeSchedule} error={Boolean(scheduleError)} helperText={scheduleError}/>
                    <TextField fullWidth sx={{ mb: 2 }} placeholder="Precio" value={price} onChange={handleChangePrice} error={Boolean(priceError)} helperText={priceError}/>
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

export default Workshop;