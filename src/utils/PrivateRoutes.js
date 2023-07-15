import { Navigate, Outlet } from 'react-router-dom'
import { useQuery, gql, useMutation } from '@apollo/client';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

const PrivateRoutes = ({auth}) => {

return (
    auth ? <Outlet/> : <Navigate to='/'/>
  )
}
  
export default PrivateRoutes;