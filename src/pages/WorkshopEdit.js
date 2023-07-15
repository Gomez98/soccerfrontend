import * as React from 'react';
import Box from '@mui/material/Box';
import { useQuery, gql, useMutation } from '@apollo/client';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { validate as validateEmail } from 'email-validator';


const UPDATE_WORKSHOP = gql`
mutation UpdateWorkshop($workshop: WorkshopInput){
    updateWorkshop(workshop:$workshop){
      id
    }
  }
`;

const WorkshopEdit = ({ workshop }) => {

    const navigate = useNavigate();

    const [schedule, setSchedule] = React.useState(workshop.schedule);
    const [scheduleError, setScheduleError] = React.useState('');

    const [name, setName] = React.useState(workshop.name);
    const [nameError, setNameError] = React.useState('');

    const [price, setPrice] = React.useState(workshop.price);
    const [priceError, setPriceError] = React.useState('');

    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');

    const [updateWorkshop, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_WORKSHOP);

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

    const handleUpdate = () => {
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
        

        updateWorkshop({
            variables: {
                workshop: {id:workshop.id,  name, schedule, price }
            }
        }).then(() => {
            setOpenSnackbar(true);
            setSnackbarMessage('Taller actualizado satisfactoriamente');
            setTimeout(() => {
                setName('')
                setSchedule([])
                setPrice('')
                navigate('/workshop');
            }, 1000);
        }).catch((error) => {
            setOpenSnackbar(true);
            setSnackbarMessage('Error al actualizar el taller');
        });
    }

    if (updateLoading) {
        return (
            <Box sx={{ width: '100%' }}>
                <LinearProgress />
            </Box>)
    }

    return (
        <Container component="main" maxWidth="sm">
             <Box sx={{ width: '300px', margin: 'auto', mt: 10}}>
                    <TextField fullWidth sx={{ mb: 2 }} placeholder="Nombre" value={name} onChange={handleChangeName} error={Boolean(nameError)} helperText={nameError}/>
                    <TextField fullWidth sx={{ mb: 2 }} placeholder="Horarios" value={schedule && schedule.join(',')} onChange={handleChangeSchedule} error={Boolean(scheduleError)} helperText={scheduleError}/>
                    <TextField fullWidth sx={{ mb: 2 }} placeholder="Precio" value={price} onChange={handleChangePrice} error={Boolean(priceError)} helperText={priceError}/>
                    <Button fullWidth sx={{ mb: 2 }} type="submit" variant="contained" onClick={handleUpdate}>Actualizar</Button>
                </Box>

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
    );
}

export default WorkshopEdit;