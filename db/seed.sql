-- Using this file to copy paste structured info into mysql workbench. Useful for swapping from desktop to laptop.
DROP DATABASE IF EXISTS manage_db;
CREATE DATABASE manage_db;

USE manage_db;

CREATE TABLE department(
  id INT AUTO_INCREMENT NOT NULL,
  name VARCHAR(30),
  PRIMARY KEY (id)
);
-- Useful for quickly showing data from each table.
SELECT * FROM department;

CREATE TABLE role(
  id INT AUTO_INCREMENT NOT NULL,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT NOT NULL,
  PRIMARY KEY (id)
);

SELECT * FROM role;

CREATE TABLE employee(
  id INT AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT NOT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id)
);

SELECT * FROM employee;

-- Data below this should not be copied unless seeding data. For normal usage, copy and paste above this line.

INSERT INTO department (name)
VALUES ("frontend");

INSERT INTO department (name)
VALUES ("backend");

INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 30000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("HTML Developer", 21000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Javascript Engineer", 23000, 2);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Conrad", "Roewing", 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Rachel", "Bennings", 2, 1);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Ben", "Wilson", 3);