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
  console.log(`We connected! Connected as thread id ${connection.thread}`);
  database();
});

function database() {
  connection.end();
}