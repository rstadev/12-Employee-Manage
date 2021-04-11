const inquirer = require('inquirer');
// const db = require('./db')
const mysql = require('mysql');
require('dotenv').config();


const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect(err => {
  if (err) throw err;
  console.log(`We connected!`);
  database();
});

function database() {
  inquirer.prompt([{
    name: 'main',
    type: 'list',
    message: 'Welcome! Please select an option.',
    choices: ['Add', 'View',
      'Update employee roles']
  },
  {
    name: 'role',
    type: 'list',
    message: 'Select an option to perform this action. Note that updating only works with employee roles.',
    choices: ['Departments', 'Roles', 'Employees']
  }
  ])
    .then(function (res) {
      switch (res.main) {
        case 'Add':
          console.log(`You chose to add to the ${res.role}`);
          break;
        case 'View':
          console.log(`You chose to view the ${res.role}`);
          viewData(res.role)
          break;
        case 'Update employee roles':
          if (res.role != 'Employee') {
            console.log('You picked something other than employee to update. Updating only workes with employee roles. Restarting program.')
            database();
          } else {
            console.log(`You chose to update a ${res.role}`);
          }
          break;
      };
    });
};

function viewData(res) {
  switch (res) {
    case 'Departments': 
    connection.query('SELECT * FROM department', function (err, result) {
      if (err) throw err;
      console.log(result);
    });
  }
};