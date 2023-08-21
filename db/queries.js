class Queries {

  constructor (db) {
    this.db = db;
  }

  getDepartments() {
    return this.db.query('SELECT * FROM department');
  }

  getRoles() {
    return this.db.query(
      `SELECT role.id, role.title, role.salary, department.name 
       FROM role JOIN department ON department.id = department_id`);
  }

  getEmployees() {
    return this.db.query(
      `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, 
              role.salary, manager.first_name AS mgr_first_name, manager.last_name AS mgr_last_name
       FROM employee AS e 
            JOIN role ON role.id = e.role_id 
            JOIN department ON department.id = role.department_id 
            LEFT JOIN employee AS manager ON manager.id = e.manager_id
      `
    );
  }

  getEmployeesByDepartment(departmentName) {
    return this.db.query(
      `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, 
              role.salary, manager.first_name AS mgr_first_name, manager.last_name AS mgr_last_name
       FROM employee AS e 
            JOIN role ON role.id = e.role_id 
            JOIN department ON department.id = role.department_id 
            LEFT JOIN employee AS manager ON manager.id = e.manager_id
       WHERE department.name = ?
      `,
      departmentName
    );
  }

  getEmployeesByManager(managerId) {
    return this.db.query(
      `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, 
              role.salary, manager.first_name AS mgr_first_name, manager.last_name AS mgr_last_name
       FROM employee AS e 
            JOIN role ON role.id = e.role_id 
            JOIN department ON department.id = role.department_id 
            LEFT JOIN employee AS manager ON manager.id = e.manager_id
       WHERE e.manager_id = ?
      `,
      managerId
    );
  }

  addDepartment(name) {
    return this.db.query(
      'INSERT INTO department (name) VALUES (?)', name
    );
  }

  deleteDepartment(name) {
    return this.db.query(
      'DELETE FROM department WHERE name = ?', name
    );
  }

  addRole(title, salary, departmentId) {
    return this.db.query(
      'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, departmentId]
    );
  }

  deleteRole(title) {
    return this.db.query(
      'DELETE FROM role WHERE title = ?', title
    );
  }

  addEmployee(firstName, lastName, roleId, managerId) {
    return this.db.query(
      'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', 
      [firstName, lastName, roleId, managerId]
    );
  }

  deleteEmployee(employeeId) {
    return this.db.query(
      'DELETE FROM employee WHERE id = ?', employeeId
    );
  }

  updateEmployeeRole(employeeId, roleId) {
    return this.db.query(
      `UPDATE employee SET role_id = ? 
       WHERE id = ?`, 
      [roleId, employeeId]
    );
  }

  updateEmployeeManager(employeeId, managerId) {
    return this.db.query(
      `UPDATE employee SET manager_id = ? 
       WHERE id = ?`, 
      [managerId, employeeId]
    );
  }

  getDepartmentBudget(departmentName) {
    /* View the total utilized budget of a department&mdash;in other words, 
       the combined salaries of all employees in that department.*/
    return this.db.query(
      `SELECT SUM( role.salary ) AS budget
       FROM employee
            JOIN role  ON employee.role_id = role.id
            JOIN department ON department.id = role.department_id
       WHERE department.name = ?
      `,
      departmentName
    )
  }
}

module.exports = Queries;
