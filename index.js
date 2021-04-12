const inquirer = require('inquirer');
// const db = require('./db')
const mysql = require('mysql');
require('dotenv').config();
//used to compare if input contains numbers
// let isnum = /^\d+$/.test(val)

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
      choices: ['Add', 'View', 'Update employee roles']
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
          if (res.role != 'Employees') {
            console.log('You picked something other than employee to update. Updating only workes with employee roles. Restarting program.')
            database();
          } else {
            console.log(`You chose to update ${res.role}`);
            updateData(res.role);
            break;
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
        connectionEnd();
      });
      break;
    case 'Roles':
      connection.query('SELECT * FROM role', function (err, result) {
        if (err) throw err;
        console.table(result);
        connectionEnd();
      });
      break;
    case 'Employees':
      connection.query('SELECT * FROM employee', function (err, result) {
        if (err) throw err;
        console.table(result);
        connectionEnd();
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
          //Cannot be left null right now. Bug.
          name: 'manager_id',
          type: 'input',
          message: 'What is the employee"s manager"s id? This can be found by viewing all employees. If the employee is a manager, or self manages, this field can be left blank.'
        },
      ])
        .then(function (res) {
          connection.query(
            'INSERT INTO employee SET ?',
            //this will not allow null values to be inserted. bug.
            {
              first_name: res.first_name,
              last_name: res.last_name,
              role_id: res.role_id,
              manager_id: res.manager_id
            },
            function (err, result) {
              if (err) throw err;
              console.log("Number of records inserted: " + result.affectedRows);
              connectionEnd();
            }
          )
        });
      break;
    case 'Roles':
      inquirer.prompt([
        {
          name: 'title',
          type: 'input',
          message: 'What is the title of the role?',
        },
        {
          name: 'salary',
          type: 'input',
          message: 'What is the desired salary for this role? Respond in numbers only.',
          // validate: async (input) => {
          //   if (input != isnum) {
          //     return 'Please select a number';
          //   }
          //   return true
          // }
        },
        {
          name: 'department_id',
          type: 'input',
          message: 'What is the desired department_id related to this role? The associated department ID can be found by viewing your created departments. Integers only.'
        },
      ])
        .then(function (res) {
          connection.query(
            'INSERT INTO role SET ?',
            //this will not allow null values to be inserted. bug.
            {
              title: res.title,
              salary: res.salary,
              department_id: res.department_id,
            },
            function (err, result) {
              if (err) throw err;
              console.log("Number of records inserted: " + result.affectedRows);
              connectionEnd();
            }
          )
        });
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
              connectionEnd();
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
};

function updateData() {
  connection.query('SELECT * FROM employee', function (err, res) {
    const employeeList = res.map(obj => {
      return {
        name: `${obj.first_name} ${obj.last_name}`,
        value: obj.id
      }
    });
    connection.query('SELECT * FROM role', function (err, res) {
      if (err) throw err;
      const roleList = res.map(obj => {
        return {
          name: obj.title,
          value: obj.id
        }
      });
      inquirer.prompt([
        {
          name: 'employee_list',
          type: 'list',
          message: 'Which employee would you like to modify?',
          choices: employeeList
        },
        {
          name: 'role_list',
          type: 'list',
          message: 'What role would you like to assign to this employee?',
          choices: roleList
        }
      ])
        .then(function (res) {
          connection.query(
            'UPDATE employee SET ? WHERE ?',
            [
              {
                role_id: res.role_list
              },
              {
                id: res.employee_list
              }
            ],
            function (err, result) {
              if (err) throw err;
              console.log("Number of records inserted: " + result.affectedRows);
              connectionEnd();
            }
          )
        })
    });
  });
};

function connectionEnd() {
  inquirer.prompt({
    name: 'continue',
    type: 'list',
    message: 'Would you like to exit now or return to the main menu?',
    choices: [
      'Return to Main Menu',
      'Exit Program'
    ]
  })
    .then(function (res) {
      switch (res.continue) {
        case 'Return to Main Menu':
          database();
          break;
        case 'Exit Program':
          connection.end();
          break;
      }
    });
};