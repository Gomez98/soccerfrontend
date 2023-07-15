import * as React from 'react';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useMutation, gql } from '@apollo/client';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import LinearProgress from '@mui/material/LinearProgress';


export default function SignIn({ onLogin, loading, error, openSnackbar, closeSnackbar }) {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');


    const handleEmail = (event) => {
        setEmail(event.target.value);
    }

    const handlePassword = (event) => {
        setPassword(event.target.value);
    }

    const handleSubmit = (event) => {
        onLogin(email, password);
    }

    const handleClose = () => {
        closeSnackbar();
    }

    if (loading) {
        return (
            <Box sx={{ width: '100%' }}>
                <LinearProgress />
            </Box>)
    }

    return (
        <Container component="main" maxWidth="sm">
            <Box sx={{ width: '100%', mt: 10 }}>
                <Box component="form">
                    <TextField
                        sx={{ mb: 5 }}
                        required
                        fullWidth
                        id="email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        placeholder="Email"
                        value={email}
                        onChange={handleEmail}
                    />
                    <TextField
                        sx={{ mb: 5 }}
                        required
                        fullWidth
                        name="password"
                        type="password"
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={handlePassword}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        onClick={handleSubmit}
                    >
                        Iniciar Sesion
                    </Button>
                    {error && (
                        <Snackbar
                            open={openSnackbar}
                            autoHideDuration={3000}
                            onClose={handleClose}
                            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        >
                            <Alert
                                onClose={handleClose}
                                variant="filled"
                                severity="error"
                                sx={{ width: '100%' }}>
                                {error.message}
                            </Alert>

                        </Snackbar>
                    )}
                    {error && (
                        <Typography variant="body1" color="error" sx={{ mt: 2 }}>
                            Ha ocurrido un error. Por favor, inténtalo de nuevo.
                        </Typography>
                    )}
                </Box>
            </Box>
        </Container>
    );
}