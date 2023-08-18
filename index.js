const db = require('./db/connection');
const inquirer = require('inquirer');

/* Test the connection

db.query(
  'SELECT * FROM department', 
  (err, results) => {
    console.log(results);
  });
*/


inquirer
  .prompt([
    {
      name:"task", 
      message:"What would you like to do?",
      type: "list",
      choices: [
        "view all departments", 
        "view all roles", 
        "view all employees", 
        "add a department", 
        "add a role", 
        "add an employee", 
        "update an employee role"
      ]
    }
  ])
  .then(answers => {
    console.log(answers);

  })
  .catch(err => {
    console.error(err);
    console.error('There was a problem asking questions. Ask the developer to debug.');
  });
  

  db.end(
    err => {
      console.error("Error closing connection to database");
    }
  );
