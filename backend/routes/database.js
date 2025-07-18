const express = require('express');
const router = express.Router();
const { sql } = require('../db');

// Get all tables
router.get('/tables', async (req, res) => {
  try {
    const result = await req.pool.request().query("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'");
    res.json(result.recordset.map(row => row.TABLE_NAME));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/connect', (req, res) => {
  const { server } = req.body;
  if (server === 'nok_server' || server === 'pyawbwe_server') {
    const { createConnectionPool, nok_server, pyawbwe_server } = require('../db');
    const serverIp = server === 'nok_server' ? nok_server : pyawbwe_server;
    const { pool, poolConnect } = createConnectionPool(serverIp);
    req.app.set('pool', pool);
    req.app.set('poolConnect', poolConnect);
    res.json({ message: `Switched to ${server}` });
  } else {
    res.status(400).json({ error: 'Invalid server name' });
  }
});

router.get('/servers', (req, res) => {
  const { nok_server, pyawbwe_server } = require('../db');
  res.json([
    { name: 'nok_server', ip: nok_server },
    { name: 'pyawbwe_server', ip: pyawbwe_server }
  ]);
});

module.exports = router;