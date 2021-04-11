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
SELECT * FROM department

CREATE TABLE role(
  id INT AUTO_INCREMENT NOT NULL,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT NOT NULL;
  PRIMARY KEY (id)
);

SELECT * FROM role

CREATE TABLE employee(
  id INT AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT NOT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id)
);

SELECT * FROM employee