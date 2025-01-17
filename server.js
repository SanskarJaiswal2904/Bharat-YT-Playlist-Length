const express = require('express');
const dotenv = require('dotenv');
const path = require('path'); // Import path to resolve the .env file path
const axios = require('axios');
const cors = require('cors'); // Import CORS



// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();


// Middleware to parse JSON requests
app.use(cors({ origin: 'http://localhost:5001' }));
app.use(express.json());


const API_KEY = process.env.YOUTUBE_API_KEY;


const PORT = process.env.PORT || 5000;

app.get('/api/v1/playlist/snippet/:id', async (req, res) => {
    const playlistId = req.params.id;
  
    if (!API_KEY) {
      return res.status(500).json({ error: 'API key not defined in environment variables.' });
    }
  
    try {
      // Make the request to YouTube API
      //this request to extract the channel name, playlist name, playlist id and thumbnails
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/playlists`,
        {
          params: {
            part: 'snippet',
            id: playlistId,
            key: API_KEY,
          },
        }
      );
  
      const data = response.data;
  
      if (!data.items || data.items.length === 0) {
        return res.status(404).json({ error: 'Playlist not found.' });
      }
  
      const playlist = data.items[0];
      const snippet = playlist.snippet;
  
      // Extract required details
      const result = {
        playlistName: snippet.title,
        playlistId: playlist.id,
        channelTitle: snippet.channelTitle,
        images: snippet.thumbnails,
      };
  
      // Send data to frontend
      res.json(result);
    } catch (error) {
      console.error('Error fetching playlist:', error.message);
      res.status(500).json({ error: 'An error occurred while fetching the playlist.' });
    }
});



// Helper function to handle pagination and fetch video durations
const getAllVideosWithDuration = async (playlistId) => {
    let allVideos = [];
    let nextPageToken = '';
    let totalVideos = 0;
    let privateVideos = 0;
    let publicVideos = 0;
    let totalDurationSeconds = 0;
    let totalViewCountPlaylist = 0;
    let totalLikeCountPlaylist = 0;

    try {
        // Loop to handle pagination
        while (true) {
            // API to extract each videoId and fetch video duration
            const response = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
                params: {
                    part: 'contentDetails',
                    playlistId: playlistId,
                    key: API_KEY,
                    maxResults: 50,
                    pageToken: nextPageToken, // Add pagination token if available
                },
            });

            // Extract video IDs
            const videoIds = response.data.items.map(item => item.contentDetails.videoId);
            
            // Fetch durations and stats for each videoId
            for (let videoId of videoIds) {
                const durationResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
                    params: {
                        part: 'contentDetails,statistics',
                        id: videoId,
                        key: API_KEY,
                    },
                });

                // Extract video duration
                const duration = durationResponse.data.items[0]?.contentDetails?.duration;
                const stats = durationResponse.data.items[0]?.statistics;

                if (duration) {
                    publicVideos++;
                    const durationMatch = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
                    const hours = durationMatch[1] ? parseInt(durationMatch[1].replace('H', '')) : 0;
                    const minutes = durationMatch[2] ? parseInt(durationMatch[2].replace('M', '')) : 0;
                    const seconds = durationMatch[3] ? parseInt(durationMatch[3].replace('S', '')) : 0;

                    totalDurationSeconds += (hours * 3600) + (minutes * 60) + seconds;

                    // Add statistics (viewCount and likeCount)
                    if (stats) {
                        totalViewCountPlaylist += parseInt(stats.viewCount);
                        totalLikeCountPlaylist += parseInt(stats.likeCount);
                    }
                } else {
                    privateVideos++;
                }

                allVideos.push({ videoId, duration });
            }

            // Check if there is a next page
            nextPageToken = response.data.nextPageToken;
            if (!nextPageToken) {
                break; // Exit loop if no next page
            }
        }

        totalVideos = allVideos.length;

        // Return the total seconds directly
        return { 
            allVideos, 
            totalVideos, 
            privateVideos, 
            publicVideos, 
            totalDurationSeconds, // Total seconds directly
            totalViewCountPlaylist,
            totalLikeCountPlaylist
        };
    } catch (error) {
        console.error('Error fetching playlist items:', error.message);
        throw new Error('Error fetching playlist items');
    }
};



app.get('/api/v1/playlist/contentDetails/:id', async (req, res) => {
    const playlistId = req.params.id;

    if (!API_KEY) {
        return res.status(500).json({ error: 'API key not defined in environment variables.' });
    }

    try {
        // Fetch all videoIds and their durations from the playlist (with pagination)
        const { 
            allVideos, 
            totalVideos, 
            privateVideos, 
            publicVideos, 
            totalDurationSeconds, 
            totalViewCountPlaylist, 
            totalLikeCountPlaylist 
        } = await getAllVideosWithDuration(playlistId);

        if (allVideos.length === 0) {
            return res.status(404).json({ error: 'No videos found in the playlist.' });
        }

        // Send the result to frontend
        res.json({ 
            videoDetails: allVideos, 
            totalVideos, 
            privateVideos, 
            publicVideos, 
            totalDurationSeconds,
            totalViewCountPlaylist,
            totalLikeCountPlaylist
        });
    } catch (error) {
        console.error('Error fetching playlist:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching the playlist.' });
    }
});


app.get('/', (req, res) => {
    console.log('Loaded API_URL:', process.env.API_URL);
    res.send('Welcome to the simple Express server!');
});

app.get('/api/v1', (req, res) => {
    const apiUrl = process.env.API_URL || 'API URL not defined';
    res.json({ message: 'API URL retrieved', apiUrl });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
