import React from 'react';
import { Box, Typography, Link, Container } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        textAlign: 'center',
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#031634' : theme.palette.primary.dark,
        color: (theme) => theme.palette.text.primary,
      }}
    >
      <Container maxWidth="md">
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          © 2024 Bharat-YT-Playlist Length by SansKar Jaiswal
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          © 2024 Bharat YouTube Playlist Length. All rights reserved.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
        🤝 Feel free to fork this repository and make your own changes.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {' '}
          <Link
            href="https://sanskarjaiswal2904.github.io/Sanskar-Website/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: 'white', fontWeight: 'bold', textDecoration: 'none' }}
          >
            <LinkIcon /> Made by SansKar with ❤.
          </Link>
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          This website is built using:{' '}
          <i
            className="fa-brands fa-html5"
            title="HTML5"
            style={{ margin: '0 10px' }}
          ></i>
          <i
            className="fa-brands fa-css3"
            title="CSS3"
            style={{ margin: '0 10px' }}
          ></i>
          <i
            className="fa-brands fa-js"
            title="JavaScript (ES6+)"
            style={{ margin: '0 10px' }}
          ></i>
          <i
            className="fa-brands fa-react"
            title="React.js"
            style={{ margin: '0 10px' }}
          ></i>
          <i
            className="fa-brands fa-node-js"
            title="Node.js"
            style={{ margin: '0 10px' }}
          ></i>


        </Typography>
        <Typography sx={{ 
            mt: 2, 
            textAlign: 'center', // Center text inside Typography
            display: 'flex', // Enables flexbox
            justifyContent: 'center', // Centers content horizontally
            alignItems: 'center' // Centers content vertically
          }}>
          <a href="https://www.hitwebcounter.com" target="_blank" rel="noreferrer">
          <img src="https://hitwebcounter.com/counter/counter.php?page=18510351&style=0024&nbdigits=7&type=ip&initCount=0" title="Counter Widget" Alt="Visit counter For Websites" border="0"/></a>    
        </Typography>
      </Container>
    </Box>
  
  );
};

export default Footer;
