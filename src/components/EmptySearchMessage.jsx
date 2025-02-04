import { Box, Typography } from '@mui/material';

function EmptySearchMessage({ message }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%', // Adjust based on your layout
        textAlign: 'center',
        padding: 2,
        backgroundColor: (theme) => theme.palette.background.default,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          color: 'text.secondary',
          fontStyle: 'italic',
          letterSpacing: '0.5px',
        }}
      >
        {message}
      </Typography>
    </Box>
  );
}

export default EmptySearchMessage;
