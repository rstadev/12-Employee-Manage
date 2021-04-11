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
  inquirer.prompt([
    {
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
          addData(res.role);
          break;
        case 'View':
          console.log(`You chose to view the ${res.role}`);
          viewData(res.role);
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
        console.table(result);
      });
      break;
    case 'Roles':
      connection.query('SELECT * FROM role', function (err, result) {
        if (err) throw err;
        console.table(result);
      });
      break;
    case 'Employees':
      connection.query('SELECT * FROM employee', function (err, result) {
        if (err) throw err;
        console.table(result);
      });
      break;
  }
};

function addData(res) {
  switch (res) {
    case 'Employees':
      inquirer.prompt([
        {
          name: 'first_name',
          type: 'input',
          message: 'What is the employee"s first name?',
        },
        {
          name: 'last_name',
          type: 'input',
          message: 'What is the employee"s last name?'
        },
        {
          name: 'role_id',
          type: 'input',
          message: 'What is the employee"s role ID? The role ID to role name can be found by viewing the role table.'
        },
        {
          name: 'manager_id',
          type: 'input',
          message: 'What is the employee"s manager"s id? This can be found by viewing all employees. If the employee is a manager, or self manages, this field can be left blank.'
        },
      ])
        .then(function (res) {
          connection.query(
            'INSERT INTO employee SET ?',
            {
              first_name: res.first_name,
              last_name: res.last_name,
              role_id: res.role_id,
              manager_id: res.manager_id
            },
            function (err, result) {
              if (err) throw err;
              console.log("Number of records inserted: " + result.affectedRows);
            }
          )
        })
        break;
    case 'Departments':
      inquirer.prompt([
        {
          name: 'dep_name',
          type: 'input',
          message: 'What is the name of the department you would like to add?'
        }
      ])
        .then(function (res) {
          connection.query(
            'INSERT INTO department SET ?',
            { name: res.dep_name },
            function (err, result) {
              if (err) throw err;
              console.log("Number of records inserted: " + result.affectedRows);
            }
          )
        });
        break;
  };

  // switch (res) {
  //   case 'Department':
  //     connection.query('SELECT * FROM department', function (err, result) {
  //       if (err) throw err;
  //       console.table(result);
  //     })
  // }
}