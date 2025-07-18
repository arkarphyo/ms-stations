const express = require('express');
const app = express();
const path = require('path');
const userRoutes = require('./routes/users');
const databaseRoutes = require('./routes/database');
const salesRoutes = require('./routes/sales');
const { createConnectionPool, pyawbwe_server } = require('./db');
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.use((req, res, next) => {
  const pool = req.app.get('pool');
  if (pool) {
    req.pool = pool;
  }
  next();
});

app.get('/', async (req, res) => {
  try {
    const pool = req.app.get('pool');
    if (!pool) {
      return res.status(500).send('Database not connected');
    }
    await req.app.get('poolConnect');
    const result = await pool.request().query('SELECT * FROM D8_User');
    res.render('index', { users: result.recordset });
  } catch (err) {
    res.status(500).send('Database Error');
  }
});

app.use('/api/database', databaseRoutes);
app.use('/api/:server/users', async (req, res, next) => {
  const { server } = req.params;
  const { createConnectionPool, nok_server, pyawbwe_server } = require('./db');
  
  if (server === 'nok_server' || server === 'pyawbwe_server') {
    const serverIp = server === 'nok_server' ? nok_server : pyawbwe_server;
    const { pool, poolConnect } = createConnectionPool(serverIp);
    try {
      await poolConnect;
      req.pool = pool;
      userRoutes(req, res, next);
    } catch (err) {
      res.status(500).json({ error: 'Database connection failed' });
    }
  } else {
    res.status(400).json({ error: 'Invalid server name' });
  }
});

app.use('/api/:server/:database', async (req, res, next) => {
  const { server, database } = req.params;
  const { createConnectionPool, nok_server, pyawbwe_server } = require('./db');

  if (server === 'nok_server' || server === 'pyawbwe_server') {
    const serverIp = server === 'nok_server' ? nok_server : pyawbwe_server;
    const { pool, poolConnect } = createConnectionPool(serverIp, database);
    try {
      await poolConnect;
      req.pool = pool;
      salesRoutes(req, res, next);
    } catch (err) {
      res.status(500).json({ error: 'Database connection failed' });
    }
  } else {
    res.status(400).json({ error: 'Invalid server name' });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
