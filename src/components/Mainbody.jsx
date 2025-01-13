// import * as React from 'react';
// import Box from '@mui/material/Box';
// import TextField from '@mui/material/TextField';
// import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';

// export default function MultilineTextFields() {
  
//   return (
//     <Box
//       component="form"
//       sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
//       noValidate
//       autoComplete="off"
//     >
//       <div>
//         <TextField
//           id="standard-multiline-static"
//           label="Playlist ID"
//           multiline
//           required
//           rows={6}
//           placeholder="https://www.youtube.com/playlist?list=ID1 https://www.youtube.com/playlist?list=ID2"
//           variant="standard"
//         />
//       </div>

      // <Card>
      //   <CardContent sx={{ paddingBottom: 0 }}>
      //     <Box
      //       sx={{
      //         width: '150px',  // Set fixed width for image container
      //         height: '150px', // Set fixed height for image container
      //         overflow: 'hidden',
      //         borderRadius: '4px',
      //       }}
      //     >
      //       <img
      //         src="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286"
      //         srcSet="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286&dpr=2 2x"
      //         loading="lazy"
      //         alt="Playlist"
      //         style={{
      //           width: '100%',   // Fill container width
      //           height: '100%',  // Fill container height
      //           objectFit: 'cover',  // Maintain aspect ratio without distortion
      //         }}
      //       />
      //     </Box>
      //     <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
      //       Word of the Day
      //     </Typography>
      //     <Typography variant="h5" component="div">
      //       be•nev•o•lent
      //     </Typography>
      //     <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>adjective</Typography>
      //     <Typography variant="body2">
      //       well meaning and kindly.
      //       <br />
      //       {'"a benevolent smile"'}
      //     </Typography>
      //   </CardContent>
      //   <CardActions sx={{ paddingTop: 0 }}>
      //     <Button size="small" title='Go to playlist in youtube'>Link</Button>
      //   </CardActions>
      // </Card>
     
//     </Box>
//   );
// }



// // const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
// /* <h1>Hi</h1> */
// /* <h1>API KEY : {API_KEY}</h1> */
// REACT_APP_YOUTUBE_API_KEY=AIzaSyDz3Ph85O7C2xha49fD_VjM3UI-6JZWQ-g



import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import axios from 'axios';

export default function PlaylistIdExtractor() {
  const [playlistIds, setPlaylistIds] = useState('');
  const [result, setResult] = useState([]);
  const [contentDetails, setContentDetails] = useState([]);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

  const handleExtractIds = async () => {
    const inputText = playlistIds.trim();
    const regex = /(?:https?:\/\/(?:www\.)?youtube\.com\/playlist\?list=|^)([a-zA-Z0-9_-]+)/g;

    const uniqueIds = new Set();
    let match;
    while ((match = regex.exec(inputText)) !== null) {
      uniqueIds.add(match[1]);
    }

    const uniqueIdsArray = Array.from(uniqueIds);

    const newResult = [];
    const newContentDetails = [];
    const newError = [];

    for (let id of uniqueIdsArray) {
      try {
        const snippetResponse = await axios.get(`${API_URL}/playlist/snippet/${id}`);
        newResult.push(snippetResponse.data);

        const contentDetailsResponse = await axios.get(`${API_URL}/playlist/contentDetails/${id}`);
        newContentDetails.push(contentDetailsResponse.data);
      } catch (err) {
        newError.push({ id, message: err.message });
      }
    }

    setResult(newResult);
    setContentDetails(newContentDetails);
    setError(newError.length > 0 ? newError : null);
  };

  const getThumbnailUrl = (images) => {
    if (images && images.maxres) return images.maxres.url;
    if (images && images.standard) return images.standard.url;
    if (images && images.high) return images.high.url;
    if (images && images.medium) return images.medium.url;
    if (images && images.default) return images.default.url;
    return '/noImage.png';
  };

  const formatDuration = (totalDurationSeconds) => {
    // Define time constants
    const secondsInMinute = 60;
    const secondsInHour = 3600;
    const secondsInDay = 86400;
    const secondsInYear = 365 * secondsInDay;

    // Calculate years, days, hours, minutes, and seconds
    let years = Math.floor(totalDurationSeconds / secondsInYear);
    totalDurationSeconds %= secondsInYear;

    let days = Math.floor(totalDurationSeconds / secondsInDay);
    totalDurationSeconds %= secondsInDay;

    let hours = Math.floor(totalDurationSeconds / secondsInHour);
    totalDurationSeconds %= secondsInHour;

    let minutes = Math.floor(totalDurationSeconds / secondsInMinute);
    let seconds = totalDurationSeconds % secondsInMinute;

    // Construct the formatted duration string
    let durationString = '';

    if (years > 0) {
        durationString += `${years} year${years > 1 ? 's' : ''}, `;
    }
    if (days > 0) {
        durationString += `${days} day${days > 1 ? 's' : ''}, `;
    }
    if (hours > 0 || years > 0 || days > 0) {
        durationString += `${String(hours).padStart(2, '0')} hour${hours !== 1 ? 's' : ''}, `;
    }
    if (minutes > 0) {
        durationString += `${String(minutes).padStart(2, '0')} minute${minutes !== 1 ? 's' : ''}, `;
    }
    durationString += `${String(seconds).padStart(2, '0')} second${seconds !== 1 ? 's' : ''}`;

    return durationString.trim();
  };

  const calculateAverageDurationAndSpeeds = (totalSeconds, publicVideos) => {
    if (!totalSeconds || publicVideos === 0) return { avgDuration: 'N/A', durationsAtSpeeds: [] };

    const avgSeconds = totalSeconds / publicVideos;

    const avgMinutes = Math.floor(avgSeconds / 60);
    const avgRemainingSeconds = Math.floor(avgSeconds % 60);
    const avgDuration = `${avgMinutes} minute${avgMinutes !== 1 ? 's' : ''}, ${avgRemainingSeconds} second${avgRemainingSeconds !== 1 ? 's' : ''}`;

    const speeds = [1.25, 1.5, 1.75, 2.0];
    const durationsAtSpeeds = speeds.map((speed) => {
      const adjustedSeconds = totalSeconds / speed;
      return {
        speed: `${speed}x`,
        duration: formatDuration(Math.round(adjustedSeconds))
      };
    });

    return { avgDuration, durationsAtSpeeds };
  };

  const formatNumber = (num) => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T+`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B+`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M+`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K+`;
    return num.toString();
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      <div>
        <TextField
          label="Playlist IDs"
          multiline
          rows={6}
          placeholder="https://www.youtube.com/playlist?list=ID1 https://www.youtube.com/playlist?list=ID2"
          variant="standard"
          value={playlistIds}
          onChange={(e) => setPlaylistIds(e.target.value)}
        />
      </div>

      <Button variant="contained" onClick={handleExtractIds}>
        Extract Playlist IDs
      </Button>

      <div>
        <h3>Result</h3>
        {result.length > 0 ? (
          result.map((playlist, index) => {
            const details = contentDetails[index] || {};
            const { avgDuration, durationsAtSpeeds } = calculateAverageDurationAndSpeeds(details.totalDurationSeconds, details.publicVideos);

            return (
              <Card key={playlist.playlistId}>
                <CardContent>
                <Box
                    sx={{
                      width: '250px',
                      height: 'auto',
                      overflow: 'hidden',
                      borderRadius: '4px',
                    }}
                  >
                    <img
                      src={getThumbnailUrl(playlist.images)}
                      loading="lazy"
                      alt="Playlist"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                  <Typography gutterBottom variant="body1" sx={{ color: 'text.primary'}} component="div">Playlist name: {playlist.playlistName}</Typography>
                  <Typography sx={{ color: 'text.secondary'}}>ID: {playlist.playlistId}</Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary'}}> Channel name: {playlist.channelTitle}</Typography>
                  <Typography sx={{ color: 'text.primary' }}>Public Videos Count: {details.publicVideos} videos ({details.privateVideos} video unavailable)</Typography>
                  <br />
                  <Typography sx={{ color: 'text.primary' }}>Total Duration: {formatDuration(details.totalDurationSeconds)}</Typography>
                  <Typography sx={{ color: 'text.primary' }}>Average Video Length: {avgDuration}</Typography>

                  {durationsAtSpeeds.map((item, idx) => (
                    <Typography sx={{ color: 'text.secondary' }} key={idx}>At {item.speed}: {item.duration}</Typography>
                  ))}

                  <br />
                  <Typography sx={{ color: 'text.primary' }}>
                        Total Views of Playlist: {contentDetails[index].totalViewCountPlaylist}
                        {formatNumber(contentDetails[index].totalViewCountPlaylist) && (
                          ` (${formatNumber(contentDetails[index].totalViewCountPlaylist)})`
                        )}
                      </Typography>
                      <Typography sx={{ color: 'text.primary' }}>
                        Total Likes of Playlist: {contentDetails[index].totalLikeCountPlaylist}
                        {formatNumber(contentDetails[index].totalLikeCountPlaylist) && (
                          ` (${formatNumber(contentDetails[index].totalLikeCountPlaylist)})`
                        )}
                      </Typography>
                </CardContent>
                <CardActions>
                  <Button href={`https://www.youtube.com/playlist?list=${playlist.playlistId}`} target="_blank">
                    View Playlist
                  </Button>
                </CardActions>
              </Card>
            );
          })
        ) : (
          <Typography>No results yet.</Typography>
        )}
      </div>

      <div>
        <h3>Errors</h3>
        {error ? <pre>{JSON.stringify(error, null, 2)}</pre> : <Typography>No errors.</Typography>}
      </div>
    </Box>
  );
}
