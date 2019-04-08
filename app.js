const express = require('express');
const app = express();

const request = require('request');
const path = require('path');

/* Untracked file thats stores API authentication information */
const { SHOPIFY } = require('./config/auth.js');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

/* Gets List of Items from Shopify */
const getShopifyItems = (SHOPIFY) => {
  request(`${SHOPIFY.API_URL}/products.json`, (error, response, items) => {
    console.log(items);
  });
}

app.listen(3030, () => `Listening in on port 3030`);
