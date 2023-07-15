
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery, gql, useMutation } from '@apollo/client';
import Box from '@mui/material/Box';

const GET_REGISTRATIONS = gql`
query AllRegistrations{
    allRegistrations{
      id
      workshopName
      schedule
      student{
        fullName
        dni
      }
    }
  }
`;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const RegistrationTable = ({ tabValue, onEdit, onDelete }) => {

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const { loading, error, data, refetch } = useQuery(GET_REGISTRATIONS);


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    React.useEffect(() => {
        if (tabValue === 'all') {
            refetch();
        }
    }, [tabValue, refetch]);

    if (loading) {
        return (
            <Box sx={{ width: '100%' }}>
                <LinearProgress />
            </Box>)
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} >
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="center">ID</StyledTableCell>
                        <StyledTableCell align="center">Nombre Estudiante</StyledTableCell>
                        <StyledTableCell align="center">DNI Estudiante</StyledTableCell>
                        <StyledTableCell align="center">Nombre Taller</StyledTableCell>
                        <StyledTableCell align="center">Horario</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(rowsPerPage > 0 && data && Array.isArray(data.allRegistrations) ? data.allRegistrations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : []).map((row) => (
                        
                        <StyledTableRow key={row.id}>
                            <StyledTableCell align="center">{row.id}</StyledTableCell>
                            <StyledTableCell align="center">{row.student.fullName}</StyledTableCell>
                            <StyledTableCell align="center">{row.student.dni}</StyledTableCell>
                            <StyledTableCell align="center">{row.workshopName}</StyledTableCell>
                            <StyledTableCell align="center">{row.schedule}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                count={data?.allRegistrations?.length || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Filas por pagina"
            />
        </TableContainer>
    )
}
export default RegistrationTable