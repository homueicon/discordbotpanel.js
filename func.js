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

app.all('/api/*', async (req, res) => {
  const url = 'https://discord.com/api/v10' + req.path.replace('/api', '');
  const r = await fetch(url, {
    method: req.method,
    headers: { 'Authorization': req.headers['authorization'], 'Content-Type': 'application/json' },
    body: ['GET','HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body)
  });
  const data = await r.json();
  res.status(r.status).json(data);
});

app.listen(process.env.PORT || 3001);
