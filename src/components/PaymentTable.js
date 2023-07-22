
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from "@mui/material/TablePagination";
import LinearProgress from '@mui/material/LinearProgress';
import { useQuery, gql } from '@apollo/client';
import Box from '@mui/material/Box';
import TextField from "@mui/material/TextField";

const GET_PAYMENTS = gql`
query AllPayments{
    allPayments(search:{}){
      id
      studentName
      mode
      amount
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
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const StudentTable = ({ tabValue }) => {

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [searchTerm, setSearchTerm] = React.useState('');

    const { loading, data, refetch } = useQuery(GET_PAYMENTS);

    const handleChangeSearchTerm = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
    };

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
            <TextField
                fullWidth
                sx={{ mb: 2 }}
                placeholder="Buscar por nombre"
                value={searchTerm}
                onChange={handleChangeSearchTerm}
            />
            <Table sx={{ minWidth: 700 }} >
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="center">ID</StyledTableCell>
                        <StyledTableCell align="center">Nombre Estudiante</StyledTableCell>
                        <StyledTableCell align="center">Modalidad</StyledTableCell>
                        <StyledTableCell align="center">Monto</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data && Array.isArray(data.allPayments)
                        ? data.allPayments
                            .filter(
                                (payment) =>
                                    payment.studentName.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => (
                                <StyledTableRow key={row.id}>
                                    <StyledTableCell align="center">{row.id}</StyledTableCell>
                                    <StyledTableCell align="center">{row.studentName}</StyledTableCell>
                                    <StyledTableCell align="center">{row.mode}</StyledTableCell>
                                    <StyledTableCell align="center">{row.amount}</StyledTableCell>
                                </StyledTableRow>
                            ))
                        : null}

                    {/*(rowsPerPage > 0 ? data.allPayments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : data).map((row) => (
                        <StyledTableRow key={row.id}>
                            <StyledTableCell align="center">{row.id}</StyledTableCell>
                            <StyledTableCell align="center">{row.studentName}</StyledTableCell>
                            <StyledTableCell align="center">{row.mode}</StyledTableCell>
                            <StyledTableCell align="center">{row.amount}</StyledTableCell>
                        </StyledTableRow>
                    ))*/}
                </TableBody>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={data.allPayments.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Filas por pagina"
                />
            </Table>
        </TableContainer>
    )
}
export default StudentTable