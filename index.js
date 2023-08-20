const db = require('./db/connection');
const inquirer = require('inquirer');
const Queries = require('./db/queries');
const AsciiTable = require('ascii-table');


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
              const matrix = [];
              const rows = results[0];
              for (var i = 0; i < rows.length; i++) {
                matrix.push( [ rows[i].id, rows[i].name ] );
              }

              console.log(results[0]);
              console.log(matrix);

              const table = new AsciiTable('Departments');
              table
                .setHeading('ID', 'Name')
                .addRowMatrix(matrix);
              
              console.log(table.toString());
            });
          break;
        case "view all roles":
          dataAccess.getRoles()
            .then(results => {
              const matrix = [];
              for (var i = 0; i < results[0].length; i++) {
                matrix.push( [ results[0][i].id, results[0][i].title, results[0][i].salary, results[0][i].name ] );
              }

              const table = new AsciiTable('Roles');
              table
                .setHeading('ID', 'Title', 'Salary', 'Department Name')
                .addRowMatrix(matrix);
              
              console.log(table.toString());
            });
          break;
        case "view all employees":
          dataAccess.getEmployees()
            .then(results => {
              const matrix = [];
              // | id | first_name | last_name | title             | department | salary | first_name | last_name |

              for (var i = 0; i < results[0].length; i++) {
                const row = results[0][i];
                matrix.push( [ row.id, `${row.first_name} ${row.last_name}`, row.title, 
                               row.department, row.salary, `${row.mgr_first_name || ''} ${row.mgr_last_name || ''}` ] );
              }

              const table = new AsciiTable('Employees');
              table
                .setHeading('ID', 'Name', 'Title', 'Department', 'Salary', 'Manager Name')
                .addRowMatrix(matrix);
              
              console.log(table.toString());
            });
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



 