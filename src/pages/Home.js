import React from 'react';
import { Typography, Button, Container, Box } from '@mui/material';
import myImage from '../images/futball.jpg';


const Portada = () => {
  return (
    <Box
      sx={{
        backgroundImage: `url(${myImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '500px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h2" sx={{ color: 'white', marginBottom: '1rem' }}>
          Academia de Deportes
        </Typography>
      </Container>
    </Box>
  );
};

const Home = () => {
  return (
    <div>
      <Portada />
      <Container maxWidth="md" sx={{ marginTop: '2rem' }}>
        <Typography variant="h5" gutterBottom>
          "¡Bienvenidos a nuestra academia de fútbol!
          Hoy nos encontramos reunidos aquí para celebrar el espíritu del deporte, la pasión por el fútbol y el deseo de crecer como jugadores y como personas.

          En nuestra academia, no solo nos enfocamos en enseñar habilidades técnicas y tácticas, sino que también promovemos valores fundamentales como el trabajo en equipo, el respeto, la disciplina y el espíritu deportivo.


        </Typography>
      </Container>
    </div>
  );
};

export default Home;
