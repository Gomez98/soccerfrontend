
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
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const GET_WORKSHOPS = gql`
query AllWorkshop{
    allWorkshops{
      id
      name
      schedule
      price
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

const WorkshopTable = ({ tabValue, onEdit, onDelete }) => {

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    
    const { loading, data, refetch } = useQuery(GET_WORKSHOPS);

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
                        <StyledTableCell align="center">Nombre</StyledTableCell>
                        <StyledTableCell align="center">Precio</StyledTableCell>
                        <StyledTableCell align="center">Acciones</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(rowsPerPage > 0 && data && Array.isArray(data.allWorkshops) ? data.allWorkshops.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : []).map((row) => (
                        <StyledTableRow key={row.id}>
                            <StyledTableCell align="center">{row.id}</StyledTableCell>
                            <StyledTableCell align="center">{row.name}</StyledTableCell>
                            <StyledTableCell align="center">{row.price}</StyledTableCell>
                            <StyledTableCell align="center">
                                <IconButton onClick={() => onEdit(row)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => onDelete(row)}>
                                    <DeleteIcon />
                                </IconButton>
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={data?.allWorkshops?.length || 0}
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
export default WorkshopTable