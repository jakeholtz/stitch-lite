const express = require("express");
const app = express();
const mysql = require('mysql')
const initiateSeedData = require("./seed.js");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  multipleStatements: true
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected TO MYSQL!");

  /* Initiate seed data (databases and table) if doesn't exist */
  connection.query(initiateSeedData, function (err, result) {
    if (err) throw err;
  });

});

module.exports.connection = connection;



