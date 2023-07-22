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
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';


const UPDATE_USER = gql`
mutation UpdateUser($user: UserInput){
    updateUser(user:$user){
      id
    }
  }
`;

const UserEdit = ({ user }) => {

    const navigate = useNavigate();

    const [firstName, setFirstName] = React.useState(user.firstName);
    const [lastName, setLastName] = React.useState(user.lastName);
    const [email, setEmail] = React.useState(user.email);
    const [role, setRole] = React.useState(user.role);

    const [emailError, setEmailError] = React.useState('');
    const [firstNameError, setFirstNameError] = React.useState('');
    const [lastNameError, setLastNameError] = React.useState('');
    const [roleError, setRoleError] = React.useState('');

    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');

    const [updateUser, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_USER);

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

    const handleChangeEmail = (event) => {
        const value = event.target.value;
        setEmail(value);
        if (value.trim() === '') {
            setEmailError('El campo de correo electrónico es obligatorio');
        } else {
            setEmailError('');
        }
    }

    const handleChangeRole = (event) => {
        const value = event.target.value;
        setRole(value);
        if (value.trim() === '') {
            setRoleError('El campo del rol es obligatorio');
        } else {
            setRoleError('');
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
        if (!email) {
            setEmailError('El email es obligatorio');
            return;
        } else if (!validateEmail(email)) {
            setEmailError('Ingrese un correo electrónico válido');
            return;
        }
        if (!role) {
            setRoleError('El rol es obligatorio');
            return;
        }

        updateUser({
            variables: {
                user: { id: user.id, firstName, lastName, email, role }
            }
        }).then(() => {
            setOpenSnackbar(true);
            setSnackbarMessage('Usuario actualizado satisfactoriamente');
            setTimeout(() => {
                setFirstName('')
                setLastName('')
                setEmail('')
                setRole('')
                navigate('/user');
            }, 2000);
        }).catch((error) => {
            setOpenSnackbar(true);
            setSnackbarMessage('Error al actualizar el usuario');
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
                <TextField fullWidth sx={{ mb: 2 }} placeholder="Email*" value={email} onChange={handleChangeEmail} required
                    error={Boolean(emailError)} helperText={emailError} />
                <FormControl fullWidth required sx={{ mb: 2 }} error={Boolean(roleError)}>
                        <InputLabel>Rol*</InputLabel>
                        <Select
                            value={role}
                            onChange={handleChangeRole}
                            label="Rol*"
                        >
                            <MenuItem value="ADMIN">ADMIN</MenuItem>
                            <MenuItem value="USER">USER</MenuItem>
                        </Select>
                        {roleError && <Alert severity="error">{roleError}</Alert>}
                    </FormControl>
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

export default UserEdit;