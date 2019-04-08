const mysql = require('mysql')
const { DATABASE } = require('../config/auth.js')
const baseQuery = 'USE stitch_lite;';

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
    sku VARCHAR(32) NOT NULL,
    quantity INT NOT NULL,
    updated_at TIMESTAMP
  );`;

const selectProducts = `${baseQuery} SELECT * FROM products`

const insertProducts = (data) => {
  let query = baseQuery;
  data.forEach(row => {
    let { name, variant, quantity, sku } = row;
    query +=
     `INSERT INTO products (name, variant, sku, quantity)
      VALUES ('${name}', '${variant}', '${sku}', '${quantity}'); `
  })
  return query;
}
  


module.exports = { createConnection, initiateDB, selectProducts, insertProducts };



