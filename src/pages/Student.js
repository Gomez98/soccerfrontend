import * as React from 'react';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useQuery, gql, useMutation  } from '@apollo/client';
import '../css/student.css'
import { Button } from '@mui/material';
import { useHistory } from 'react-router-dom';

const STUDENTS_ROLES = gql`
query AllStudentRoles{
    allStudentRoles{
      name
      id
    }
  }
`;

const SUBMIT_STUDENT = gql`
query AddStudent($student: StudentInput){
    addStudent(student:$student){
      firstName
      lastName
      age
    }
  }
`;

const Student = () => {

    const history = useHistory();
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [age, setAge] = React.useState('');
    const [role, setRole] = React.useState('');

    const { loading, error, data } = useQuery(STUDENTS_ROLES);
    const [submit_student, { data, loading, error }] = useMutation(SUBMIT_STUDENT);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message}</p>;

    
    const handleChangeFirstName = (event) => {
        setFirstName(event.target.value);
    }
    const handleChangeLastName = (event) => {
        setLastName(event.target.value);
    }
    const handleChangeAge = (event) => {
        setAge(event.target.value);
    }
    const handleChangeRole = (event) => {
        setRole(event.target.value);
    }
    const submitStudent = () => {
        submit_student({ variables: { student:{firstName: firstName, lastName: lastName, age: age, role: role} }});
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error : {error.message}</p>;
        alert('Student Saved');
        history.push('/');
    }
    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1 },
            }}
            noValidate
            autoComplete="off"
            className='student-form'
        >
            <Input placeholder="First Name" value={firstName} onChange={handleChangeFirstName} />
            <Input placeholder="Last Name" value={lastName} onChange={handleChangeLastName}/>
            <Input placeholder="Age" value={age} onChange={handleChangeAge}/>
            <FormControl >
                <InputLabel id="demo-simple-select-label">Student Role</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={role}
                    label="Role"
                    onChange={handleChangeRole}
                >
                    {data.allStudentRoles.map(role => {
                        return (
                            <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
                        )})
                    }

                </Select>
            </FormControl>
            <Button onClick={submitStudent}></Button>
        </Box>
    )
};

export default Student;