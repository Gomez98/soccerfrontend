import * as React from 'react';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import UserTable from '../components/UserTable';
import { validate as validateEmail } from 'email-validator';


const ADD_USER = gql`
mutation AddUser($user: UserInput){
    addUser(user:$user){
      firstName
      lastName
      email
      role
      password
    }
  }
`;

const UPDATE_USER = gql`
mutation UpdateUser($user: UserInput){
    updateUser(user:$user){
      id
    }
  }
`;

const User = ({ onChangeUser }) => {

    const navigate = useNavigate();
    const [tabValue, setTabValue] = React.useState('all');
    const [firstName, setFirstName] = React.useState('');
    const [role, setRole] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [emailError, setEmailError] = React.useState('');
    const [firstNameError, setFirstNameError] = React.useState('');
    const [lastNameError, setLastNameError] = React.useState('');
    const [roleError, setRoleError] = React.useState('');

    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');

    const [submitUser, { loading: submitLoading, error: submitError }] = useMutation(ADD_USER);
    const [updateUser, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_USER);


    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue)
    }

    const handleDelete = (user) => {
        handleUpdateUser({ ...user, deleted: true });
    }

    const handleEdit = (user) => {
        onChangeUser(user)
        navigate('/user/edit/' + user.id);
    }

    const handleUpdateUser = (selectedUser) => {
        const { __typename, ...updatedUser } = selectedUser;

        updateUser({
            variables: { user: updatedUser }
        }).then(() => {
            setOpenSnackbar(true);
            setSnackbarMessage('Usuario actualizado satisfactoriamente');
            setTimeout(() => {
                setTabValue('all')
            }, 2000);
        }).catch((error) => {
            setOpenSnackbar(true);
            setSnackbarMessage('Error al actualizar el usuario');
        });
    }

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

    const handleSubmit = () => {
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

        submitUser({
            variables: {
                user: { firstName, lastName, email, role }
            }
        }).then(() => {
            setOpenSnackbar(true);
            setSnackbarMessage('Usuario registrado satisfactoriamente');
            setTimeout(() => {
                setFirstName('')
                setLastName('')
                setEmail('')
                setRole('')
                setTabValue('all')
            }, 2000);
        }).catch((error) => {
            setOpenSnackbar(true);
            setSnackbarMessage('Error al registrar el usuario');
        });
    }

    const handleCloseSnackBar = () => {
        setOpenSnackbar(false);
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
                    <Tab value="create" label="Registrar Usuario" />
                </Tabs>
            </Box>

            {tabValue === 'all' && (
                <UserTable tabValue={tabValue} onDelete={handleDelete} onEdit={handleEdit} />
            )}


            {(tabValue == "create") && (
                <Box sx={{ width: '300px', margin: 'auto' }}>
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
                    <Button fullWidth sx={{ mb: 2 }} type="submit" variant="contained" onClick={handleSubmit}>Registrar</Button>

                </Box>
            )
            }

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

export default User;