const inquirer = require('inquirer');
// const db = require('./db')
const mysql = require('mysql');
require('dotenv').config()


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
    choices: ['Department', 'Role', 'Employee']
  }
  ])
    .then(function (res) {
      switch (res.main) {
        case 'Add':
          console.log(`You chose to add a ${res.role}`);
          break;
        case 'View':
          console.log(`You chose to add a ${res.role}`);
          break;
        case 'Update employee roles':
          console.log(`You chose to add a ${res.role}`);
          break;
      }
    })
  // connection.end();
}