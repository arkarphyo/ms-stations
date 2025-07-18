const express = require('express');
const router = express.Router();
const { sql } = require('../db');

router.get('/:table/daily_sale', async (req, res) => {
  const { table } = req.params;
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
  const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

  try {
    const result = await req.pool.request()
      .input('startDate', sql.DateTime, startDate)
      .input('endDate', sql.DateTime, endDate)
      .query(`SELECT * FROM ${table} WHERE S_Date BETWEEN @startDate AND @endDate`);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;