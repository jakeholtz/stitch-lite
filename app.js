const express = require('express');
const app = express();

const request = require('request');
const path = require('path');
const db = require('./db/database.js');
const { SHOPIFY } = require('./config/auth.js');

/* Use client directory */
app.use(express.static('client'));
app.use('/client', express.static(__dirname + '/client'));

/* Send initial HTML */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

/* Get updated products and send to AngularJS FE */
app.get('/products', (req, res) => {
  const { createConnection, initiateDB, selectProducts, insertProducts } = db;
  const connection = createConnection();

  connection.connect((err) => {
    if (err) throw err;

    /* Initiate seed data (databases and table) if doesn't exist */
    connection.query(initiateDB, (err, result) => { if (err) throw err; });

    /* get shopify information */
    request(`${SHOPIFY.API_URL}/products.json`, (error, response, data) => {
      var shopifyData = parseShopifyItems(data);

      /* Update DB with shopify, get DB products */
      connection.query(insertProducts(shopifyData), function (err) {
        if (err) throw err;

        connection.query(selectProducts, function (err, result) {
          if (err) throw err;
          const [request, data] = result;
  
          res.send(data);
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

app.listen(3030, () => `Listening in on port 3030`);
