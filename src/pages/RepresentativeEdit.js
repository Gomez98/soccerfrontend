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
import Autocomplete from '@mui/material/Autocomplete';

const UPDATE_REPRESENTATIVE = gql`
mutation UpdateRepresentative($representative: RepresentativeInput){
    updateRepresentative(representative:$representative){
      id
    }
  }
`;

const GET_STUDENTS = gql`
query AllStudents{
    allStudents{
      id
      fullName
    }
  }
`;

const RepresentativeEdit = ({ representative, student }) => {

    const navigate = useNavigate();

    const [selectedStudent, setSelectedStudent] = React.useState(student);
    const [representativeName, setRepresentativeName] = React.useState(representative.name);
    const [representativeNameError, setRepresentativeNameError] = React.useState('');
    const [studentNameError, setStudentNameError] = React.useState('');

    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');

    const { loading: studentsMLoading, error: studentsMError, data: studentsData } = useQuery(GET_STUDENTS);
    const [updateRepresentative, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_REPRESENTATIVE);

    const handleRepresentativeName = (event) => {
        if (event.target.value.trim() === '') {
            setRepresentativeNameError('El campo de nombres es obligatorio');
        } else {
            setRepresentativeNameError('');
        }
        setRepresentativeName(event.target.value);
    }

    const handleSelectedStudent = (event, value) => {
        if (event.target.value && event.target.value.trim() === '') {
            setStudentNameError('El campo de nombres es obligatorio');
        } else {
            setStudentNameError('');
        }
        setSelectedStudent(value);
    };

    const handleUpdate = () => {
        if (!representativeName) {
            setRepresentativeNameError('El nombre es obligatorio');
            return;
        }
        if (!selectedStudent.fullName) {
            setStudentNameError('El nombre del estudiante es obligatorio');
            return;
        }
        updateRepresentative({
            variables: {
                representative: { id: representative.id, name: representativeName, studentName: selectedStudent.fullName }
            }
        }).then(() => {
            setOpenSnackbar(true);
            setSnackbarMessage('Apoderado actualizado satisfactoriamente');
            setTimeout(() => {
                setRepresentativeName('')
                setSelectedStudent(null)
                navigate('/representative');
            }, 2000);
        }).catch((error) => {
            setOpenSnackbar(true);
            setSnackbarMessage('Error al actualizar el apoderado');
        });
    }

    if (updateLoading) {
        return (
            <Box sx={{ width: '100%' }}>
                <LinearProgress />
            </Box>)
    }
    if (studentsMLoading) {
        return (
            <Box sx={{ width: '100%' }}>
                <LinearProgress />
            </Box>)
    }
    
    return (
        <Container component="main" maxWidth="sm">
           <Box sx={{ width: '300px', margin: 'auto', mt: 10}}>
                <TextField required fullWidth sx={{ mb: 2, mt: 5 }} id="name" name="name" placeholder="Nombre" value={representativeName} onChange={handleRepresentativeName} error={Boolean(representativeNameError)} helperText={representativeNameError} />

                {studentsData ? (
                    <Autocomplete
                        id="demo-simple-select"
                        sx={{ mb: 2 }}
                        options={studentsData.allStudents || []}
                        getOptionLabel={(option) => option.fullName ? option.fullName : ''}
                        value={selectedStudent}
                        onChange={handleSelectedStudent}
                        renderInput={(params) => (
                            <TextField {...params} label="Estudiante" error={Boolean(studentNameError)} helperText={studentNameError}/>
                        )}
                        renderOption={(props, option) => (
                            <li {...props} key={option.id}>
                                <TextField sx={{ "& fieldset": { border: "none" } }}
                                    value={option.fullName ? option.fullName : ''}
                                />
                            </li>
                        )}
                    />
                ) : (
                    <div>Loading students...</div>
                )}


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

export default RepresentativeEdit;