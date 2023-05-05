const algorism = require('./algorism.js');

module.exports.getPlaylistData = async (req, res) => {
  try {
    const API_KEY = process.env.GOOGLE_API_KEY;
    const { url } = req.body;

    const regex = /^https?:\/\/(?:www\.)?youtube\.com\/playlist\?list=([a-zA-Z0-9_-]+)$/;
    const isYouTubePlaylistLink = url => {
      return regex.test(url);
    };

    if (!isYouTubePlaylistLink(url)) {
      return res.status(400).json({ message: 'Not valid youtube playlist link' });
    }

    const PLAYLIST_ID = url.match(/list=([\w-]+)/)[1];
    const data = await algorism(API_KEY, PLAYLIST_ID);

    res.status(200).json(data);
  } catch (error) {
    if (error.code === 404) {
      const errors = error.errors.map(el => el.message);
      res.status(404).json({ errors });
    } else {
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  }
};
