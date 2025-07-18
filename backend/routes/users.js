const express = require('express');
const router = express.Router();
const { sql } = require('../db'); // ✅ Correct MSSQL import

// Get all users
router.get('/', async (req, res) => {
  try {
    const result = await req.pool.request().query('SELECT * FROM D8_User');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add user
router.post('/', async (req, res) => {
  const { name, password, type, status } = req.body;
  try {
    await req.pool.request()
      .input('name', sql.VarChar, name)
      .input('password', sql.VarChar, password)
      .input('type', sql.VarChar, type)
      .input('status', sql.VarChar, status)
      .query('INSERT INTO D8_User (User_Name, Password, User_Type, Status) VALUES (@name, @password, @type, @status)');
    res.json({ message: 'User added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  const { name, password, type, status } = req.body;
  const id = req.params.id;
  try {
    await req.pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.VarChar, name)
      .input('password', sql.VarChar, password)
      .input('type', sql.VarChar, type)
      .input('status', sql.VarChar, status)
      .query(`
        UPDATE D8_User
        SET User_Name = @name, Password = @password, User_Type = @type, Status = @status
        WHERE id = @id
      `);
    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await req.pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM D8_User WHERE id = @id');
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
