/* TO DO 
  - Connect Vend
  - Dynamically update DB / inventory only based off of updated date
  - Reformulate from callbacks to promises
  - Reformulate from raw SQL to ORM
*/

const express = require('express');
const app = express();

const request = require('request');
const path = require('path');
const db = require('./db/database.js');
const { SHOPIFY } = require('./config/auth.js');
const { createConnection, createProducts, selectProducts } = db;

/* Use client directory */
app.use(express.static('client'));
app.use('/client', express.static(__dirname + '/client'));

/* Send initial HTML */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

/* Get updated products and send to AngularJS FE */
app.get('/products', (req, res) => {
  const connection = createConnection();

  connection.connect((err) => {
    if (err) throw err;

    /* get shopify information */
    request(`${SHOPIFY.API_URL}/products.json`, (error, response, data) => {
      var shopifyData = parseShopifyItems(data);

      /* Initiate seed data (databases and table) if doesn't exist */
      connection.query(createProducts(shopifyData), (err, result) => {
        if (err) throw err;

        connection.query(selectProducts(), function (err, result) {
          if (err) throw err;
          res.send(formatResult(result));
        });

      });
    });
  });
});

function parseShopifyItems(data) {
  data = JSON.parse(data);
  let items = [];
  data.products.forEach(item => {
    let { title: name, variants, inventory_quantity: quantity, sku, updated_at } = item;

    if (!variants) {
      items.push({ name, variant: null, quantity, sku, updated_at });
    } else {
      variants.forEach(variantItem => {
        let { title: variant, inventory_quantity: quantity, sku, updated_at } = variantItem;
        items.push({ name, variant, quantity, sku, updated_at })
      });
    }
  })
  return items;
}

function formatResult(result) {
  const [info, data] = result;
  return data;
}

/* API endpoints  */
app.get('/api/products', (req, res) => {
  createConnection().query(selectProducts(), function (err, result) {
    if (err) throw err;
    res.send(formatResult(result));
  });
});

app.get('/api/products/:productId', (req, res) => {
  const { productId } = req.params;

  createConnection().query(selectProducts('id', productId), function (err, result) {
    if (err) throw err;
    res.send(formatResult(result));
  });
});

app.post('/api/sync', (req, res) => {
  request(`${SHOPIFY.API_URL}/products.json`, (error, response, data) => {
    const shopifyData = parseShopifyItems(data);
    const connection = createConnection();

    connection.query(createProducts(shopifyData), (err, result) => {
      if (err) throw err;

      connection.query(selectProducts(), function (err, result) {
        if (err) throw err;
        res.send('Products updated successfully');
      });
    });
  });
});


app.listen(3030, () => `Listening in on port 3030`);
