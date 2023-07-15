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
import PaymentTable from '../components/PaymentTable'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';

const ADD_PAYMENT_MUTATION = gql`
mutation AddPayment($payment:PaymentInput){
    addPayment(payment:$payment){
        studentName
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

const GET_DUES = gql`
mutation AllDuesByStudentId($studentId: String){
    allDuesByStudentId(studentId: $studentId){
        id
        studentId
        name
        amount
        status
        creationDate
        dueDate
        registrationId
        workshopName
    }
  }
`;

const PAY_DUES = gql`
mutation UpdateDues($dueIds: [String]){
    payDues(dueIds: $dueIds){
     id
     studentId
     name
     amount
     status
      creationDate
      dueDate
      registrationId
      workshopName
    }
  }  
`;

const modes = [{ id: 0, name: 'YAPE' }, { id: 1, name: 'PLIN' }, { id: 2, name: 'EFECTIVO' }]

const Payment = () => {

    const navigate = useNavigate();
    const [selectedStudent, setSelectedStudent] = React.useState('');
    const [selectedMode, setSelectedMode] = React.useState('');
    const [selectedAmounts, setSelectedAmounts] = React.useState([]);
    const [totalAmount, setTotalAmount] = React.useState(0);
    const [tabValue, setTabValue] = React.useState('all');
    const [selectedDues, setSelectedDues] = React.useState([]);
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [selectedStudentError, setSelectedStudentError] = React.useState('');


    const { loading: studentsLoading, data: studentsData } = useQuery(GET_STUDENTS);
    const [findDues, { loading: duesLoading, data: duesData }] = useMutation(GET_DUES);
    const [submitPayment] = useMutation(ADD_PAYMENT_MUTATION);
    const [payDues] = useMutation(PAY_DUES);

    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue)
    }

    const handleSelectedStudent = (event, value) => {
        
        if (event.target.value && event.target.value.trim() === '') {
            setSelectedStudentError('El campo de nombres es obligatorio');
        } else {
            setSelectedStudentError('');
        }
        setSelectedStudent(value);
        findDues({
            variables: {
                studentId: value.id
            }
        })
    };

    const handleSelectAmount = (dueId, amount) => {
        const isSelected = selectedAmounts.includes(dueId);
        let updatedAmounts;

        if (isSelected) {
            updatedAmounts = selectedAmounts.filter((id) => id !== dueId);
        } else {
            updatedAmounts = [...selectedAmounts, dueId];
        }
        setSelectedAmounts(updatedAmounts);
        setSelectedDues(updatedAmounts)
        const newTotalAmount = isSelected
            ? totalAmount - amount
            : totalAmount + amount;
        setTotalAmount(newTotalAmount);
    };

    const handleSelectedMode = (event, value) => {
        setSelectedMode(event.target.value)
    }

    const handleSubmit = () => {
        payDues({
            variables:{
                dueIds:selectedDues
            }
        }).then(() => {
            submitPayment({
                variables: {
                    payment: { studentId: selectedStudent.id, studentName: selectedStudent.fullName, amount: totalAmount, mode: selectedMode.name }
                }
            }).then(() => {
                setOpenSnackbar(true);
                setSnackbarMessage('Pago registrado satisfactoriamente');
                setTimeout(() => {
                    setSelectedStudent('')
                    setSelectedDues('')
                    setTabValue('all')
                    navigate('/payment');
                }, 2000);
            }).catch((error) => {
                setOpenSnackbar(true);
                setSnackbarMessage('Error al registrar el pago');
            });

        })
    }

    if (studentsLoading || duesLoading) {
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
                    <Tab value="create" label="Registrar Pago" />
                </Tabs>
            </Box>
            {tabValue === 'all' && (
                <PaymentTable tabValue={tabValue} />
            )}

            {tabValue === "create" && (
                <Box>
                    <Box sx={{ width: '300px', margin: 'auto' }}>
                        {studentsData ? (
                            <Autocomplete
                                id="demo-simple-select"
                                sx={{ mb: 2 }}
                                options={studentsData.allStudents || []}
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
                            <InputLabel id="demo-simple-select-label" >Modalidad</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedMode}
                                label="Modalidad"
                                onChange={handleSelectedMode}
                            >
                                {modes.map(mode => {
                                    return (
                                        <MenuItem key={mode.id} value={mode} >{mode.name}</MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                    </Box>

                    {selectedStudent && (
                        <Box sx={{ minWidth: 700, mb: 5 }}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Nombre</TableCell>
                                            <TableCell>Taller</TableCell>
                                            <TableCell>Fecha de creación</TableCell>
                                            <TableCell>Fecha de vencimiento</TableCell>
                                            <TableCell>Estado</TableCell>
                                            <TableCell>Monto</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {duesData.allDuesByStudentId.map((due) => (
                                            <TableRow key={due.id}>
                                                <TableCell>{due.id}</TableCell>
                                                <TableCell>{due.name}</TableCell>
                                                <TableCell>{due.workshopName}</TableCell>
                                                <TableCell>{due.creationDate}</TableCell>
                                                <TableCell>{due.dueDate}</TableCell>
                                                <TableCell>{due.status}</TableCell>
                                                <TableCell>{due.amount}</TableCell>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedAmounts.includes(due.id)}
                                                        onChange={() => handleSelectAmount(due.id, due.amount)}
                                                        disabled={due.status === 'PAID'}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                    <Box sx={{ width: '300px', margin: 'auto' }}>
                        <Button fullWidth type="submit" variant="contained" onClick={handleSubmit}>Registrar</Button>
                    </Box>
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

export default Payment;