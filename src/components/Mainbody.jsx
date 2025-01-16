import React, { useState } from 'react';
import { Button, CircularProgress, Box, TextField } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import EmptySearchMessage from './EmptySearchMessage';
import IndiaGlobal from './IndiaGlobal';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';




export default function PlaylistIdExtractor() {
  const [playlistIds, setPlaylistIds] = useState('');
  const [result, setResult] = useState([]);
  const [contentDetails, setContentDetails] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showThumbnail, setShowThumbnail] = useState(true);



  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';


  const handleExtractIds = async () => {
    setResult([]);
    setContentDetails([]);
    setError(null);
    setLoading(false);
    setCopiedIndex(null);

    const inputText = playlistIds.trim();
    const regex = /(?:https?:\/\/(?:www\.)?youtube\.com\/playlist\?list=|^|\s)([a-zA-Z0-9_-]{18,34})/g;

    const uniqueIds = new Set();
    let match;
    while ((match = regex.exec(inputText)) !== null) {
      uniqueIds.add(match[1]);
    }

    const uniqueIdsArray = Array.from(uniqueIds);
    console.log(uniqueIdsArray);

    const newResult = [];
    const newContentDetails = [];
    const newError = [];
    setLoading(true);
    for (let id of uniqueIdsArray) {
      try {
        const snippetResponse = await axios.get(`${API_URL}/playlist/snippet/${id}`);
        newResult.push(snippetResponse.data);

        const contentDetailsResponse = await axios.get(`${API_URL}/playlist/contentDetails/${id}`);
        newContentDetails.push(contentDetailsResponse.data);
      } catch (err) {
        newError.push({ id, message: err.message });
        setLoading(false);
      }
    }

    setResult(newResult);
    setContentDetails(newContentDetails);
    setError(newError.length > 0 ? newError : null);
    setLoading(false);
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

  const formatPercentage = (likeCount, viewCount) => {
    if (viewCount === 0) return 0; // Prevent division by zero
    let num = ((likeCount / viewCount) * 100); 
    if(num < 0){
      return num.toFixed(4); // if its less than zero, returns percentage with 2 decimal points
    } else{
      return num.toFixed(2); // Returns percentage with 2 decimal points
    }
  };

  return (
    <Box sx={{
      backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#03132fe8' : theme.palette.grey[100],
      color: (theme) => theme.palette.text.primary,
      }}>
      <Box sx={{
        ml: { xs: 2, sm: 10, md: 20, lg: 45 }, // Responsive margin-left
      }}>
        <Box>
          <IndiaGlobal/>
        </Box>
        <Typography variant='h5' fontWeight={'bold'}>
          Find the length of any YouTube playlist:
        </Typography>
        <Typography variant='body4' sx={{my: 2}} >
          You can enter a playlist link, playlist ID or even multiple playlist ID or playlist link!
        </Typography>
      </Box>
    <Box component="form" noValidate autoComplete="off" sx={{
      gap: 2, // Adds space between the cards
      padding: 2, // Optional padding for the container
    }}>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column', // Ensures the TextField and Button are stacked
        alignItems: 'center', // Centers the TextField and Button horizontally
        width: '100%', // Makes the container responsive
      }}
    >
      
      <TextField
        label="Playlist IDs"
        multiline
        rows={6}
        placeholder="https://www.youtube.com/playlist?list=ID1&#10;https://www.youtube.com/playlist?list=ID2&#10;or just,&#10;ID1&#10;ID2"
        variant="standard"
        value={playlistIds}
        onChange={(e) => setPlaylistIds(e.target.value)}
        sx={{
          width: { xs: '90%', sm: '80%', md: '70%' },
          minWidth: '300px',
          maxWidth: '800px',
          marginBottom: 2,
        }}
      
      />
        <Box
          sx={{
            display: 'flex',
            justifyContent: { xs: 'space-between', sm: 'space-around', md: 'space-around', lg: 'space-around', xl: 'space-around' },
            alignItems: 'center',
            width: '100%',
            mb: 5,
          }}
        >
          <Tooltip title='Show playlist thumbnail' placement="top">
          <IconButton>
            <FormControlLabel
              control={
                <Checkbox
                  inputProps={{ 'aria-label': 'Checkbox demo' }}
                  checked={showThumbnail}
                  color="secondary"
                  onChange={(e) => setShowThumbnail(e.target.checked)}
                />
              }
              label="Show Thumbnail"
            />
          </IconButton>
          </Tooltip>
          <Tooltip title='Clear Playlist IDs' placement="top">
          <IconButton>
              <Button
                variant="text"
                color="success"
                onClick={() => setPlaylistIds('')}
              >
                Clear
              </Button>
            </IconButton>
            </Tooltip>
        </Box>


      {loading ? (
        <CircularProgress />
      ) : (
      <Tooltip title="Analyze" placement="top">
        <IconButton>
          <Button
            variant="contained"
            onClick={handleExtractIds}
            sx={{
              width: { xs: '50%', sm: '40%', md: '30%' }, // Button size is responsive
              minWidth: '120px', // Minimum width for usability
            }}
          >
            Analyze
          </Button>
        </IconButton>
      </Tooltip>
      )}
    </Box>

      <br /> <br /> <br />


      <div>
      <Grid container spacing={2}>
        {result.length > 0 ? (
          result.map((playlist, index) => {
            const details = contentDetails[index] || {};
            const { avgDuration, durationsAtSpeeds } = calculateAverageDurationAndSpeeds(details.totalDurationSeconds, details.publicVideos);

            return (
              <Grid item xs={12} sm={8} md={6} lg={4} key={playlist.playlistId}>
              <Card key={playlist.playlistId} sx={{backgroundColor: (theme) => theme.palette.background.default,}}>
                <CardContent>
                {showThumbnail && (
                      <Box
                        sx={{
                          width: { xs: '250px', sm: '270px', md: '300px', lg: '350px', xl: '450px' },
                          height: { xs: 'auto', sm: 'auto', md: 'auto', lg: 'auto', xl: 'auto' },
                          overflow: 'hidden',
                          borderRadius: '4px',
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          margin: '0 auto', // Centers the entire Box itself
                          marginBottom: '10px',

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
                      </Box> )}
                  <Typography
                    gutterBottom
                    variant="body1"
                    sx={{
                      color: 'text.primary',
                      fontSize: { xs: '0.875rem', md: '1rem' },
                      fontWeight: 'bold', // Makes the text bold
                    }}component="div">Playlist name: {playlist.playlistName}</Typography>
                  <Typography sx={{ color: 'text.primary', fontSize: { xs: '0.875rem', md: '1rem' }}}>ID: {playlist.playlistId}</Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: { xs: '0.875rem', md: '1rem' }, fontStyle: 'italic',}}> Channel name: {playlist.channelTitle}</Typography>
                  <Typography sx={{ color: 'text.primary', fontSize: { xs: '0.875rem', md: '1rem' } }}>Public Videos Count: {details.publicVideos} videos ({details.privateVideos} video unavailable)</Typography>
                  <br />
                  <Typography sx={{ color: 'text.primary', fontSize: { xs: '0.875rem', md: '1rem' } }}>Total Duration: {formatDuration(details.totalDurationSeconds)}</Typography>
                  <Typography sx={{ color: 'text.primary', fontSize: { xs: '0.875rem', md: '1rem' } }}>Average Video Duration: {avgDuration}</Typography>

                  {durationsAtSpeeds.map((item, idx) => (
                    <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.875rem', md: '1rem' } }} key={idx}>At {item.speed}: {item.duration}</Typography>
                  ))}

                  <br />
                  <Typography sx={{ color: 'text.primary', fontSize: { xs: '0.875rem', md: '1rem' } }}>
                        Total Views of Playlist: {contentDetails[index].totalViewCountPlaylist}
                        {formatNumber(contentDetails[index].totalViewCountPlaylist) && (
                          ` (${formatNumber(contentDetails[index].totalViewCountPlaylist)})`
                        )}
                      </Typography>
                      <Typography sx={{ color: 'text.primary', fontSize: { xs: '0.875rem', md: '1rem' } }}>
                        Total Likes of Playlist: {contentDetails[index].totalLikeCountPlaylist}
                        {formatNumber(contentDetails[index].totalLikeCountPlaylist) && (
                          ` (${formatNumber(contentDetails[index].totalLikeCountPlaylist)})`
                        )}
                      </Typography>
                      <Typography sx={{ color: 'text.primary', fontSize: { xs: '0.875rem', md: '1rem' } }}>
                        Like % of Playlist: ~{formatPercentage(contentDetails[index].totalLikeCountPlaylist, contentDetails[index].totalViewCountPlaylist)}%
                      </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', width: '100%' }}>
                  <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    direction="row" // Ensures buttons are placed side-by-side
                    sx={{
                      display: 'flex',
                      gap: 2, // Gap creates space between buttons
                      textAlign: 'center', // Center-align the text inside buttons
                    }}
                  >
                  <Tooltip title='View playlist in new tab' placement="top">
                    <IconButton> 
                      <Button
                        href={`https://www.youtube.com/playlist?list=${playlist.playlistId}`}
                        target="_blank"
                        sx={{
                          padding: { xs: '8px 16px', sm: '10px 20px' }, // Adjust padding for screen size
                        }}
                      >
                        View Playlist
                      </Button>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Copy Details' placement="top">
                    <IconButton>
                      <Button
                        onClick={() => {
                          const data = {
                            "Playlist name": playlist.playlistName,
                            "ID": playlist.playlistId,
                            "Channel name": playlist.channelTitle,
                            "Public Videos Count": `${details.publicVideos} videos (${details.privateVideos} video unavailable)`,
                            "Total Duration": formatDuration(details.totalDurationSeconds),
                            "Average Video Duration": avgDuration,
                            "Total Views of Playlist": `${contentDetails[index].totalViewCountPlaylist} (${formatNumber(contentDetails[index].totalViewCountPlaylist)})`,
                            "Total Likes of Playlist": `${contentDetails[index].totalLikeCountPlaylist} (${formatNumber(contentDetails[index].totalLikeCountPlaylist)})`,
                            "Like % of Playlist": `~${formatPercentage(contentDetails[index].totalLikeCountPlaylist, contentDetails[index].totalViewCountPlaylist)}%`,
                            "Playlist Link": `https://www.youtube.com/playlist?list=${playlist.playlistId}`,
                          };
                          navigator.clipboard.writeText(
                            Object.entries(data)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join("\n")
                          );
                          setCopiedIndex(index);
                          setTimeout(() => setCopiedIndex(null), 1400);
                        }}
                        disabled={copiedIndex === index}
                        sx={{
                          padding: { xs: '8px 16px', sm: '10px 20px' }, // Ensure consistent padding
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1, // Adds gap between text and icon
                        }}
                      >
                        {copiedIndex === index ? (
                          <>
                            Copied
                            <i className="fa-solid fa-check"></i>
                          </>
                        ) : (
                          <>
                            Copy
                            <i className="fa-regular fa-copy"></i>
                          </>
                        )}
                      </Button>
                    </IconButton>
                  </Tooltip>
                  </Grid>
                </CardActions>

              </Card>
              </Grid>

            );
          })
        ) : (
          <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', ml: { xs: 2, sm: 10, md: 20, lg: 45 },
          my: 3}}>
            {loading ? (
              <EmptySearchMessage message="Searching..." />
            ) : (
              <EmptySearchMessage message="Search for a playlist to get its details." />
            )}
          </Box>
        )}
        </Grid>
      </div>

      {error && (
        <div>
          <h3>Errors</h3>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}

      </Box>
    </Box>

  );
}
