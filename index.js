const db = require('./db/connection');
const inquirer = require('inquirer');
const Queries = require('./db/queries');


db.then( connection => {
  const dataAccess = new Queries(connection);
  
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
  
      switch (answers.task) {
        case "view all departments":
          // When using the Promise version of mysql2, results is an array of two items
          // The returned rows is first item, and table metadata is the 2nd row. 
          // We only need to look at the returned rows.

          dataAccess.getDepartments()
            .then(results => {
              console.log(results[0]);
            });
          break;
        case "view all roles":
          dataAccess.getRoles()
            .then(results => console.log(results[0]));
          break;
        case "view all employees":
          break;
        case "add a department":
          break;
        case "add a role":
          break;
        case "add an employee":
          break; 
        case "update an employee role":
          break;
      }
  
    })
    .catch(err => {
      console.error(err);
      console.error('There was a problem asking questions. Ask the developer to debug.');
    })
    .finally(
      () => connection.end( err => {
        if(err) {
          console.error("Error closing connection to database");
        }
      } )
    );
  }
);



 