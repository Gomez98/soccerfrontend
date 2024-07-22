import * as React from 'react';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useQuery, gql, useMutation } from '@apollo/client';
import '../css/student.css'
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import TextField from "@mui/material/TextField";
import LinearProgress from '@mui/material/LinearProgress';
import Autocomplete from '@mui/material/Autocomplete';
import Container from "@mui/material/Container";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import '../css/global.css'
import RepresentativeTable from '../components/RepresentativeTable'

const ADD_REPRESENTATIVE_MUTATION = gql`
mutation AddRepresentative($representative: RepresentativeInput){
    addRepresentative(representative:$representative){
      name
    }
  }
`;

const UPDATE_REPRESENTATIVE = gql`
mutation UpdateRepresentative($representative: RepresentativeInput){
    updateRepresentative(representative:$representative){
      id
    }
  }
`;

const GET_STUDENTS = gql`
query AllStudents{
    allStudents(search:{}){
      id
      fullName
    }
  }
`;

export default function Representative({onChangeRepresentative}) {

    const navigate = useNavigate();
    const [representativeName, setRepresentativeName] = React.useState('');
    const [representativeNameError, setRepresentativeNameError] = React.useState('');
    const [studentNameError, setStudentNameError] = React.useState('');
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [selectedStudent, setSelectedStudent] = React.useState('');
    const [tabValue, setTabValue] = React.useState('all');
    const [snackbarMessage, setSnackbarMessage] = React.useState('');

    const { loading: studentsLoading, error: studentsError, data: studentsData } = useQuery(GET_STUDENTS);
    const [submitRepresentative, { loading: addLoading, error: addError }] = useMutation(ADD_REPRESENTATIVE_MUTATION);
    const [updateRepresentative, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_REPRESENTATIVE);

    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue)
    }

    const handleDelete = (representative) => {
        handleUpdateRepresentative({ ...representative, deleted: true});
    }

    const handleUpdateRepresentative = (selectedRepresentative) => {
        const { __typename, ...updatedRepresentative } = selectedRepresentative;
        updateRepresentative({
            variables: {representative: updatedRepresentative}
        }).then(() => {
            setOpenSnackbar(true);
            setSnackbarMessage('Apoderado actualizado satisfactoriamente');
            setTimeout(() => {
                setTabValue('all')
                refetch();
            }, 2000);
        }).catch((error) => {
            setOpenSnackbar(true);
            setSnackbarMessage('Error al actualizar el apoderado');
        });
    }

    const handleEdit = (representative) => {
        const student = studentsData.allStudents.find(student => student.fullName == representative.studentName)
        onChangeRepresentative(representative, student)
        navigate('/representative/edit/'+ representative.id);
    }

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

    const handleSubmit = () => {
        if (!representativeName) {
            setRepresentativeNameError('El nombre es obligatorio');
            return;
        }
        if (!selectedStudent) {
            setStudentNameError('El nombre del estudiante es obligatorio');
            return;
        }
        submitRepresentative({
            variables: {
                representative: { name: representativeName, studentName: selectedStudent.fullName }
            }
        }).then(() => {
            setOpenSnackbar(true);
            setSnackbarMessage('Apoderado registrado satisfactoriamente');
            setTimeout(() => {
                setRepresentativeName('')
                setSelectedStudent('')
                setTabValue('all')
                refetch()
            }, 2000);
        }).catch((error) => {
            setOpenSnackbar(true);
            setSnackbarMessage('Error al registrar el apoderado');
        });
    }

    const handleClose = () => {
        setOpenSnackbar(false);
    }


    if (studentsLoading) {
        return (
            <Box sx={{ width: '100%' }}>
                <LinearProgress />
            </Box>)
    }
    if (addLoading) {
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
        <Container component="main" >
            <Box sx={{ width: '100%', bgcolor: 'background.paper', mt: 10, mb: 5 }}>
                <Tabs value={tabValue} onChange={handleChangeTab} centered>
                    <Tab value="all" label="Todos" />
                    <Tab value="create" label="Registrar Apoderado" />
                </Tabs>
            </Box>
            {tabValue === 'all' && (
                <RepresentativeTable tabValue={tabValue} onDelete={handleDelete} onEdit={handleEdit}/>
            )}

             {(tabValue == "create") && (
                <Box  sx={{ width: '300px', margin: 'auto' }}>
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


                <Button fullWidth sx={{ mb: 2 }} type="submit" variant="contained" onClick={handleSubmit}>Submit</Button>

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
