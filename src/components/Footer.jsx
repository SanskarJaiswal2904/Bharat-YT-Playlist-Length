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
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgb(35, 39, 47)' : theme.palette.grey[200],
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
        {' '}
          <Link
            href="https://sanskarjaiswal2904.github.io/Sanskar-Website/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: 'primary.main', fontWeight: 'bold', textDecoration: 'none' }}
          >
          <LinkIcon/>  Made by SansKar
          </Link>
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          This website is built using: 
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
