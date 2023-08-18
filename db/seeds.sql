USE employee_tracker_db;

insert into department (name) values('Sales');
insert into department (name) values('Customer Service');
insert into department (name) values('Finance');
insert into department (name) values('Human Resources');

insert into role (title, salary, department_id) 
  values('Sales Manager', 50000, 1);
insert into role (title, salary, department_id) 
  values('Senior Sales Manager', 70000, 1);
insert into role (title, salary, department_id) 
  values('Senior Accountant', 75000, 3);

insert into employee (first_name, last_name, role_id, manager_id) 
  values('Owen','Jones',4,NULL);
insert into employee (first_name, last_name, role_id, manager_id) 
  values('Sally','Smith',3,1); 
insert into employee (first_name, last_name, role_id, manager_id) 
  values('Fred','Law',1,1);

/*
mysql> select employee.id,first_name,last_name,role.title,role.salary,department.name as department 
from employee join role on role.id=role_id join department on department.id=department_id;
+----+------------+-----------+-------------------+--------+------------+
| id | first_name | last_name | title             | salary | department |
+----+------------+-----------+-------------------+--------+------------+
|  1 | Owen       | Jones     | CEO               | 100000 | Executive  |
|  2 | Sally      | Smith     | Senior Accountant |  75000 | Finance    |
|  3 | Fred       | Law       | Sales Manager     |  50000 | Sales      |
+----+------------+-----------+-------------------+--------+------------+
3 rows in set (0.00 sec)
*/
