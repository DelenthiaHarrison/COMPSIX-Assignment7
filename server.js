require('dotenv').config();
const express = require('express');
const { sequelize, Track } = require('./database/setup');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/tracks', async (req, res) => {
  try {
    const tracks = await Track.findAll();
    res.json({ success: true, count: tracks.length, data: tracks });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to retrieve tracks.' });
  }
});

app.get('/api/tracks/:id', async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id);
    if (!track) {
      return res.status(404).json({ success: false, error: `Track with id ${req.params.id} not found.` });
    }
    res.json({ success: true, data: track });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to retrieve track.' });
  }
});

app.post('/api/tracks', async (req, res) => {
  const { songTitle, artistName, albumName, genre, duration, releaseYear } = req.body;
  if (!songTitle || !artistName || !albumName || !genre) {
    return res.status(400).json({ success: false, error: 'Missing required fields: songTitle, artistName, albumName, and genre are all required.' });
  }
  try {
    const newTrack = await Track.create({ songTitle, artistName, albumName, genre, duration, releaseYear });
    res.status(201).json({ success: true, data: newTrack });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create track.' });
  }
});

app.put('/api/tracks/:id', async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id);
    if (!track) {
      return res.status(404).json({ success: false, error: `Track with id ${req.params.id} not found.` });
    }
    const { songTitle, artistName, albumName, genre, duration, releaseYear } = req.body;
    const [rowsUpdated] = await Track.update(
      { songTitle, artistName, albumName, genre, duration, releaseYear },
      { where: { trackId: req.params.id } }
    );
    if (rowsUpdated === 0) {
      return res.status(400).json({ success: false, error: 'No changes were made.' });
    }
    const updatedTrack = await Track.findByPk(req.params.id);
    res.json({ success: true, data: updatedTrack });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update track.' });
  }
});

app.delete('/api/tracks/:id', async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id);
    if (!track) {
      return res.status(404).json({ success: false, error: `Track with id ${req.params.id} not found.` });
    }
    await track.destroy();
    res.json({ success: true, message: `Track "${track.songTitle}" has been deleted.` });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete track.' });
  }
});

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established.');
    app.listen(PORT, () => {
      console.log(`🎵 Music Library API running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
}

startServer();