const mysql = require('mysql2');

const db = mysql.createConnection(
  {
    host: 'localhost', // the local machine
    user: 'root', // database login - default user name when you install mysql
    password: '', // empty password is the default, otherwise would be actual password
    database: 'employee_tracker_db' // make this the current database for the connection
  }
);

module.exports = db;
