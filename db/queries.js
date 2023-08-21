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

  addDepartment(name) {
    return this.db.query(
      'INSERT INTO department (name) VALUES (?)', name
    );
  }

  addRole(title, salary, departmentId) {
    return this.db.query(
      'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, departmentId]
    );
  }

  addEmployee(firstName, lastName, roleId, managerId) {
    return this.db.query(
      'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', 
      [firstName, lastName, roleId, managerId]
    );
  }
}

module.exports = Queries;
