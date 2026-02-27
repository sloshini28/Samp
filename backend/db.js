const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Sitaram@10',
  database: 'student_db'
});

db.connect(err => {
  if (err) {
    console.log('⚠️ Database not connected — running without DB');
  } else {
    console.log('✅ MySQL Connected!');
  }
});

module.exports = db;
