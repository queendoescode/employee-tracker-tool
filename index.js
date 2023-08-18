const db = require('./db/connection');
const inquirer = require('inquirer');

function taskMenu() {
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
        db.query(
          'SELECT * FROM department', 
          (err, results) => {
            if (err) {
              console.error(err);
            } else {
              console.log(results);
            }
          });
        break;
      case "view all roles":
        break;
      case "view all employees":
        break;
      case "add a department":
        break;
      case  "add a role":
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
    () => db.end( err => {
      if(err) {
        console.error("Error closing connection to database");
      }
    } )
  );
}


taskMenu();
      

  

