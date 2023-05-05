const { google } = require('googleapis');

async function algorism(API_KEY, PLAYLIST_ID) {
  // Create a new YouTube Data API client
  const youtube = google.youtube({
    version: 'v3',
    auth: API_KEY,
  });

  // Get the playlist items
  const getPlaylistItems = async function (playlistId, pageToken) {
    const res = await youtube.playlistItems.list({
      part: 'contentDetails',
      playlistId,
      maxResults: 50,
      pageToken,
    });

    return res.data;
  };

  // Get the video details
  const getVideoDetails = async function (videoIds) {
    const res = await youtube.videos.list({
      part: 'contentDetails',
      id: videoIds,
    });

    return res.data;
  };

  // Logic
  let totalSeconds = 0;
  let nextPageToken = '';
  let videoCount = 0;
  const res = [];

  do {
    const playlistItems = await getPlaylistItems(PLAYLIST_ID, nextPageToken);

    // Extract the video IDs from the playlist items
    const videoIds = playlistItems.items.map(item => item.contentDetails.videoId);

    // Call the videos.list method to retrieve the video details
    const videoDetails = await getVideoDetails(videoIds);

    // Sum the duration of each video
    const videoSeconds = videoDetails.items.reduce((total, item) => {
      const duration = item.contentDetails.duration;
      const hours = duration.match(/(\d+)H/);
      const minutes = duration.match(/(\d+)M/);
      const seconds = duration.match(/(\d+)S/);

      return (
        total +
        (hours ? parseInt(hours[1]) * 3600 : 0) +
        (minutes ? parseInt(minutes[1]) * 60 : 0) +
        (seconds ? parseInt(seconds[1]) : 0)
      );
    }, 0);

    totalSeconds += videoSeconds;
    videoCount += videoIds.length;

    nextPageToken = playlistItems.nextPageToken;
  } while (nextPageToken);

  // Calculate average length of video
  const avgSeconds = totalSeconds / videoCount;
  const avgMinutes = Math.floor(avgSeconds / 60);
  const avgSecondsRem = Math.round(avgSeconds % 60);
  const formattedAvgLength = `${avgMinutes} minutes, ${avgSecondsRem} seconds`;

  // Format the total length as hours, minutes, and seconds
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
  const seconds = totalSeconds - hours * 3600 - minutes * 60;
  const formattedLength = `${hours} hours, ${minutes} minutes, ${seconds} seconds`;

  res.push(`No of videos : ${videoCount}`);
  res.push(`Average length of video : ${formattedAvgLength}`);
  res.push(`Total length of playlist : ${formattedLength}`);

  // Define the playback speeds to calculate the length at
  const playbackSpeeds = [1.25, 1.5, 1.75, 2];

  // Calculate the length at different playback speeds
  playbackSpeeds.forEach(speed => {
    const length = totalSeconds / speed;
    const hours = Math.floor(length / 3600);
    const minutes = Math.floor((length - hours * 3600) / 60);
    const seconds = Math.floor(length - hours * 3600 - minutes * 60);
    const formattedLength = `${hours} hours, ${minutes} minutes, ${seconds} seconds`;

    res.push(`At ${speed.toFixed(2)}x : ${formattedLength}`);
  });

  return res;
}

module.exports = algorism;
