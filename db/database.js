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

const selectProducts = (column, value) => {
  let query = `${baseQuery} SELECT * FROM products`;
  if (!column || !value) return `${query};`;
  return `${query} WHERE ${column} = ${value};`;
}

const insertProducts = (data) => {
  let query = baseQuery;
  data.forEach(row => {
    let { name, variant, quantity, sku, updated_at } = row;
    updated_at = new Date(updated_at).toISOString().slice(0, 19).replace('T', ' ');
    query +=
     `REPLACE INTO products (name, variant, sku, quantity, updated_at)
      VALUES ('${name}', '${variant}', '${sku}', '${quantity}', '${updated_at}'); `
  })
  return query;
}

const createProducts = (data) => {
  let query = `CREATE DATABASE IF NOT EXISTS stitch_lite;
    USE stitch_lite;
    CREATE TABLE IF NOT EXISTS products (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      variant VARCHAR(255) NOT NULL,
      sku VARCHAR(32) NOT NULL UNIQUE,
      quantity INT NOT NULL,
      updated_at TIMESTAMP
    ); `;
    if (data) query += insertProducts(data);
    return query;
};

module.exports = { createConnection, createProducts, selectProducts };



