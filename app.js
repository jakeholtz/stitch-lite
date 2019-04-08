const express = require('express');
const app = express();

const request = require('request');
const path = require('path');
const db = require('./db/database.js');

/* Untracked file thats stores API authentication information */
const { SHOPIFY } = require('./config/auth.js');

/* Use client directory */
app.use(express.static('client'));
app.use('/client', express.static(__dirname + '/client'));

/* Send initial HTML */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

/* Get Products From DB and send to AngularJS FE */
app.get('/products', (req, res) => {
  const { createConnection, initiateDB, selectProducts } = db;
  const connection = createConnection();

  connection.connect((err) => {
    if (err) throw err;

    /* Initiate seed data (databases and table) if doesn't exist */
    connection.query(initiateDB, (err, result) => { if (err) throw err; });

    /* Get products */
    connection.query(selectProducts, function (err, result) {
      if (err) throw err;
      const [request, data] = result;
      res.send(data);
    });

  });
});

/* Gets List of Items from Shopify */
const getShopifyItems = (SHOPIFY) => {
  request(`${SHOPIFY.API_URL}/products.json`, (error, response, items) => {
    console.log(JSON.parse(items));
  });
}

app.listen(3030, () => `Listening in on port 3030`);
