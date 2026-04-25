const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.all('*', async (req, res) => {
  if (req.path === '/') return res.send('Discord Bot Panel Proxy is running.');

  const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  const url = 'https://discord.com/api/v10' + req.path + qs;

  console.log(req.method, url);

  try {
    const r = await fetch(url, {
      method: req.method,
      headers: {
        'Authorization': req.headers['authorization'] || '',
        'Content-Type': 'application/json',
        'User-Agent': 'DiscordBot (panel, 1.0)'
      },
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body)
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('Proxy running on port ' + PORT));
