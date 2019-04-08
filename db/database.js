const mysql = require('mysql')
const { DATABASE } = require('../config/auth.js')

function createConnection() {
  return mysql.createConnection({
    host: DATABASE.HOST,
    user: DATABASE.USERNAME,
    password: DATABASE.PASSWORD,
    multipleStatements: true
  });
}

const initiateDB =
 `CREATE DATABASE IF NOT EXISTS stitch_lite;
  USE stitch_lite;
  CREATE TABLE IF NOT EXISTS products (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    variant VARCHAR(255) NOT NULL,
    SKU VARCHAR(32) NOT NULL,
    quantity INT NOT NULL
  );`;

const selectProducts = 'USE stitch_lite; SELECT * FROM products'

module.exports = { createConnection, initiateDB, selectProducts };



