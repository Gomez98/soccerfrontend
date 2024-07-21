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


const UPDATE_STUDENT = gql`
mutation UpdateStudent($student: StudentInput){
    updateStudent(student:$student){
      id
    }
  }
`;

const StudentEdit = ({ student }) => {

    const navigate = useNavigate();

    const [firstName, setFirstName] = React.useState(student.firstName);
    const [lastName, setLastName] = React.useState(student.lastName);
    const [age, setAge] = React.useState(student.age);
    const [dni, setDni] = React.useState(student.dni);
    const [email, setEmail] = React.useState(student.email);

    const [emailError, setEmailError] = React.useState('');
    const [firstNameError, setFirstNameError] = React.useState('');
    const [lastNameError, setLastNameError] = React.useState('');
    const [ageError, setAgeError] = React.useState('');
    const [dniError, setDniError] = React.useState('');

    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');

    const [updateStudent, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_STUDENT);

    const handleChangeFirstName = (event) => {
        setFirstName(event.target.value);
        if (event.target.value.trim() === '') {
            setFirstNameError('El campo de nombres es obligatorio');
        } else {
            setFirstNameError('');
        }
    }
    const handleChangeLastName = (event) => {
        setLastName(event.target.value);
        if (event.target.value.trim() === '') {
            setLastNameError('El campo de apellidos es obligatorio');
        } else {
            setLastNameError('');
        }
    }
    const handleChangeAge = (event) => {
        
        const inputAge = event.target.value;

        if (inputAge === '' || /^\d+$/.test(inputAge)) {
            setAge(inputAge); 
            setAgeError('');   
        } else {
            setAgeError('El campo de edad solo permite números positivos');
        }
    }
   
    const handleChangeDni = (event) => {
        const inputDni = event.target.value;
    
        if (inputDni === '' || /^\d{1,8}$/.test(inputDni)) {
            setDni(inputDni); 
            setDniError('');   
        } else {
            setDniError('Numero de documento solo permite números positivos');
        }

    }
    const handleChangeEmail = (event) => {
        const value = event.target.value;
        setEmail(value);
        if (value.trim() === '') {
            setEmailError('El campo de correo electrónico es obligatorio');
        } else {
            setEmailError('');
        }
    }

    const handleUpdate = () => {
        if (!firstName) {
            setFirstNameError('El nombre es obligatorio');
            return;
        }
        if (!lastName) {
            setLastNameError('El apellido es obligatorio');
            return;
        }
        if (!age) {
            setAgeError('La edad es obligatoria');
            return;
        }
        if (!dni) {
            setDniError('El DNI/Pasaporte es obligatorio');
            return;
        } else if (dni.length < 8) {
            setDniError('El DNI/Pasaporte debe tener al menos 8 dígitos');
            return;
        }
        if (!email) {
            setEmailError('El email es obligatorio');
            return;
        } else if (!validateEmail(email)) {
            setEmailError('Ingrese un correo electrónico válido');
            return;
        }


        const ageValue = parseInt(age, 10);
        updateStudent({
            variables: {
                student: { id: student.id, firstName, lastName, age: ageValue, dni, email }
            }
        }).then(() => {
            setOpenSnackbar(true);
            setSnackbarMessage('Estudiante actualizado satisfactoriamente');
            setTimeout(() => {
                setAge('')
                setFirstName('')
                setLastName('')
                setDni('')
                setEmail('')
                navigate('/student');
            }, 2000);
        }).catch((error) => {
            setOpenSnackbar(true);
            setSnackbarMessage('Error al actualizar el estudiante');
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
            <Box sx={{ width: '300px', margin: 'auto', mt: 10 }}>
                <TextField fullWidth sx={{ mb: 2 }} placeholder="Nombres*" value={firstName} onChange={handleChangeFirstName} required error={Boolean(firstNameError)} helperText={firstNameError} />
                <TextField fullWidth sx={{ mb: 2 }} placeholder="Apellidos*" value={lastName} onChange={handleChangeLastName} required
                    error={Boolean(lastNameError)} helperText={lastNameError} />
                <TextField fullWidth sx={{ mb: 2 }} type="text" placeholder="Edad*" value={age} onChange={handleChangeAge} required
                    error={Boolean(ageError)} helperText={ageError} />
                <TextField fullWidth sx={{ mb: 2 }} type="text" placeholder="Dni*" value={dni} onChange={handleChangeDni} required error={Boolean(dniError)} helperText={dniError} inputProps={{ min: 8 }} />
                <TextField fullWidth sx={{ mb: 2 }} placeholder="Email*" value={email} onChange={handleChangeEmail} required
                    error={Boolean(emailError)} helperText={emailError} />
                <Button fullWidth sx={{ mb: 2 }} type="submit" variant="contained" onClick={handleUpdate}>Actualizar</Button>

            </Box>

            {openSnackbar && (<Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={() => setOpenSnackbar(false)} severity="info" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>)}
        </Container>
    );
}

export default StudentEdit;