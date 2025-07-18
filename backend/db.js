const sql = require('mssql');
const nok_server = "100.78.72.19";
const pyawbwe_server = "100.71.203.36";

const createConnectionPool = (server, database = 'e_Fillingstation') => {
  const config = {
    user: 'sa',
    password: 'infosys2019iss',
    server, // Your MSSQL IP
    port: 1433,              // ✅ Correct MSSQL port
    database,
    options: {
      encrypt: false,        // Use true if connecting over Azure or SSL
      trustServerCertificate: true
    }
  };

  const pool = new sql.ConnectionPool(config);
  const poolConnect = pool.connect();
  
  poolConnect.then(() => {
    console.log(`✅ Connected to MSSQL at ${server} on database ${database}`);
  }).catch(err => {
    console.error(`❌ MSSQL connection to ${server} on database ${database} failed:`, err);
  });

  return { pool, poolConnect };
};

module.exports = { sql, createConnectionPool, nok_server, pyawbwe_server };