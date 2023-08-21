const db = require('./db/connection');
const inquirer = require('inquirer');
const Queries = require('./db/queries');
const AsciiTable = require('ascii-table');

function formatEmployeeResults(results, tableTitle) {
  const matrix = [];
  for (var i = 0; i < results[0].length; i++) {
    const row = results[0][i];
    matrix.push( [ row.id, `${row.first_name} ${row.last_name}`, row.title, 
                   row.department, row.salary, `${row.mgr_first_name || ''} ${row.mgr_last_name || ''}` ] );
  }

  const table = new AsciiTable(tableTitle);
  table
    .setHeading('ID', 'Name', 'Title', 'Department', 'Salary', 'Manager Name')
    .addRowMatrix(matrix);
  
  console.log(table.toString());
}

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
          "update an employee role",
          "update an employee manager",
          "view employees by department",
          "view employees by manager"
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

          return dataAccess.getDepartments()
            .then(results => {
              const matrix = [];
              const rows = results[0];
              for (var i = 0; i < rows.length; i++) {
                matrix.push( [ rows[i].id, rows[i].name ] );
              }

              const table = new AsciiTable('Departments');
              table
                .setHeading('ID', 'Name')
                .addRowMatrix(matrix);
              
              console.log(table.toString());
            });

        case "view all roles":
          return dataAccess.getRoles()
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

        case "view all employees":
          return dataAccess.getEmployees()
            .then(results => {
              formatEmployeeResults(results, 'Employees')
            });

        case "add a department":
          return inquirer
            .prompt([
              {
                name:"departmentName", 
                message:"What is the name of the department you want to add?",
                type: "text"
              }
            ])
            .then(answers => {
              dataAccess.addDepartment(answers.departmentName)
                .then(result => console.log(`Department "${answers.departmentName}" has been added.`));
            });

        case "add a role":
          return dataAccess.getDepartments()
          .then(
            result => {
              const departments = result[0];
              const departmentNames = [];
              for (var i = 0; i < departments.length; i++) {
                departmentNames.push(departments[i].name);
              }
              return inquirer
              .prompt([
                {
                  name:"roleTitle", 
                  message:"What is the title of the role you want to add?",
                  type: "text"
                },
                {
                  name:"salary", 
                  message:"What is the salary of this role?",
                  type: "text"
                },
                {
                  name:"departmentName", 
                  message:"What is the department of this role?",
                  type: "list",
                  choices: departmentNames
                }
              ])
              .then(answers => {
                const departmentRow = departments.find(dept => dept.name === answers.departmentName);
                dataAccess.addRole(answers.roleTitle, answers.salary, departmentRow.id)
                  .then(result => console.log(`Role "${answers.roleTitle}" has been added.`));
              });
            }
          );
        
        case "add an employee":
          return dataAccess.getRoles()
          .then( roleResults => {
              return dataAccess.getEmployees()
              .then( employeeResults => {
                const roles = roleResults[0];
                const roleTitles = [];
                for (var i = 0; i < roles.length; i++) {
                  roleTitles.push(roles[i].title);
                }

                const employees = employeeResults[0];
                const employeeNames = [];
                for (var i = 0; i < employees.length; i++) {
                  employeeNames.push(`${employees[i].first_name} ${employees[i].last_name}`);
                }

                return inquirer
                .prompt([
                  {
                    name:"firstName", 
                    message:"What is the employee's first name?",
                    type: "text"
                  },
                  {
                    name:"lastName", 
                    message:"What is the employee's last name?",
                    type: "text"
                  },
                  {
                    name:"roleTitle", 
                    message:"What is the employee's role?",
                    type: "list",
                    choices: roleTitles
                  },
                  {
                    name:"managerName", 
                    message:"What is the employee's manager?",
                    type: "list",
                    choices: employeeNames
                  }
                ])
                .then(answers => {
                  const roleRow = roles.find(role => role.title === answers.roleTitle);
                  const managerRow = employees.find(emp => `${emp.first_name} ${emp.last_name}` === answers.managerName);
                  dataAccess.addEmployee(answers.firstName, answers.lastName, roleRow.id, managerRow.id)
                    .then(result => console.log(`Employee "${answers.firstName} ${answers.lastName}" has been added.`));
                });
              });
            }
          )

        case "update an employee role":
          return dataAccess.getRoles()
          .then( roleResults => {
              return dataAccess.getEmployees()
              .then( employeeResults => {
                const roles = roleResults[0];
                const roleTitles = [];
                for (var i = 0; i < roles.length; i++) {
                  roleTitles.push(roles[i].title);
                }

                const employees = employeeResults[0];
                const employeeNames = [];
                for (var i = 0; i < employees.length; i++) {
                  employeeNames.push(`${employees[i].first_name} ${employees[i].last_name}`);
                }

                return inquirer
                .prompt([
                  {
                    name:"employeeName", 
                    message:"Select an employee to update:",
                    type: "list",
                    choices: employeeNames
                  },
                  {
                    name:"roleTitle", 
                    message:"What is the employee's new role?",
                    type: "list",
                    choices: roleTitles
                  },
                ])
                .then(answers => {
                  const roleRow = roles.find(role => role.title === answers.roleTitle);
                  const employeeRow = employees.find(emp => `${emp.first_name} ${emp.last_name}` === answers.employeeName);
                  dataAccess.updateEmployeeRole(employeeRow.id, roleRow.id)
                    .then(result => console.log(`Employee "${answers.employeeName}" has been updated.`));
                });
              });
            }
          );

        case "update an employee manager":
          return dataAccess.getEmployees()
          .then( employeeResults => {
              const employees = employeeResults[0];
              const employeeNames = [];
              for (var i = 0; i < employees.length; i++) {
                employeeNames.push(`${employees[i].first_name} ${employees[i].last_name}`);
              }

              return inquirer
              .prompt([
                {
                  name:"employeeName", 
                  message:"Select an employee to update:",
                  type: "list",
                  choices: employeeNames
                },
                {
                  name:"managerName", 
                  message:"Who is the employee's new manager?",
                  type: "list",
                  choices: employeeNames
                },
              ])
              .then(answers => {
                const employeeRow = employees.find(emp => `${emp.first_name} ${emp.last_name}` === answers.employeeName);
                const managerRow = employees.find(emp => `${emp.first_name} ${emp.last_name}` === answers.managerName);
                dataAccess.updateEmployeeManager(employeeRow.id, managerRow.id)
                  .then(result => console.log(`Employee "${answers.employeeName}" has been updated.`));
              });
            }
          );

        case "view employees by department":
          return dataAccess.getDepartments()
          .then(
            result => {
              const departments = result[0];
              const departmentNames = [];
              for (var i = 0; i < departments.length; i++) {
                departmentNames.push(departments[i].name);
              }
              return inquirer
              .prompt([
                {
                  name:"departmentName", 
                  message:"Show employees for which department?",
                  type: "list",
                  choices: departmentNames
                }
              ])
              .then(answers => {
                dataAccess.getEmployeesByDepartment(answers.departmentName)
                  .then(results => {
                    formatEmployeeResults(results, `Employees in department ${answers.departmentName}`);
                  });
              });
            }
          );

        case "view employees by manager":
          return dataAccess.getEmployees()
          .then( employeeResults => {
              const employees = employeeResults[0];
              const employeeNames = [];
              for (var i = 0; i < employees.length; i++) {
                employeeNames.push(`${employees[i].first_name} ${employees[i].last_name}`);
              }

              return inquirer
              .prompt([
                {
                  name:"managerName", 
                  message:"Show employees under which manager?",
                  type: "list",
                  choices: employeeNames
                },
              ])
              .then(answers => {
                const managerRow = employees.find(emp => `${emp.first_name} ${emp.last_name}` === answers.managerName);
                dataAccess.getEmployeesByManager(managerRow.id)
                  .then(results => {
                    formatEmployeeResults(results, `Employees under manager ${answers.managerName}`);
                  });
              });
            }
          );

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



 