const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'roundhouse.proxy.rlwy.net',
    user: 'root',
    password: 'RATDLkWrdCzuCnTPrcBOcqLPgJgJNItx',
    database: 'railway',
    port: 42496 
});

db.connect(function(err) {
    if (err) throw err;
    console.log('DATABASE CONNECTED!');
});

module.exports = db;
				