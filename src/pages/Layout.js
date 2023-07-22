import * as React from 'react';
import { Outlet, Link } from "react-router-dom";
import Box from '@mui/material/Box';
import '../css/layout.css'
import { ListItemText } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';

const drawerWidth = 240;

const Layout = ({ auth, onLogout, navigate }) => {


    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexGrow: 1 }}>
                        {auth ? (
                            <Typography variant="h6" noWrap component="div">
                                <Link className="nav-soccer-link" onClick={onLogout}>Cerrar Sesion</Link>
                            </Typography>
                        ) : (
                            <>

                                <Typography variant="h6" noWrap component="div" sx={{ ml: 5 }}>
                                    <Link to="/" className="nav-soccer-link">Inicio</Link>
                                </Typography>
                                <Typography variant="h6" noWrap component="div" sx={{ ml: 5 }}>
                                    <Link to="/login" className="nav-soccer-link">Iniciar Sesion</Link>
                                </Typography>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
            {auth && <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        <ListItem disablePadding>
                                <ListItemText primary={'Mantenimiento'}></ListItemText>
                        </ListItem>
                        <ListItem disablePadding>
                            <Link to="/student" className="nav-link">
                                <ListItemButton>
                                    <ListItemText primary={'Estudiantes'}></ListItemText>
                                </ListItemButton>
                            </Link>
                        </ListItem>
                        <ListItem disablePadding>
                            <Link to="/representative" className="nav-link">
                                <ListItemButton>
                                    <ListItemText primary={'Apoderados'}></ListItemText>
                                </ListItemButton>
                            </Link>
                        </ListItem>
                        <ListItem disablePadding>
                            <Link to="/workshop" className="nav-link">
                                <ListItemButton>
                                    <ListItemText primary={'Talleres'}></ListItemText>
                                </ListItemButton>
                            </Link>
                        </ListItem>
                        <ListItem disablePadding>
                            <Link to="/user" className="nav-link">
                                <ListItemButton>
                                    <ListItemText primary={'Usuarios'}></ListItemText>
                                </ListItemButton>
                            </Link>
                        </ListItem>
                        <ListItem disablePadding>
                                <ListItemText primary={'Procesos'}></ListItemText>
                        </ListItem>
                        <ListItem disablePadding>
                            <Link to="/payment" className="nav-link">
                                <ListItemButton>
                                    <ListItemText primary={'Pagos'}></ListItemText>
                                </ListItemButton>
                            </Link>
                        </ListItem>
                        <ListItem disablePadding>
                            <Link to="/registration" className="nav-link">
                                <ListItemButton>
                                    <ListItemText primary={'Matriculas'}></ListItemText>
                                </ListItemButton>
                            </Link>
                        </ListItem>
                       
                    </List>
                </Box>
            </Drawer>}

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>

                <Outlet />
            </Box>
        </Box>
    )
};

export default Layout;