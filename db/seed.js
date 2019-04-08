module.exports =
 ` CREATE DATABASE IF NOT EXISTS stitch_lite;
   USE stitch_lite;
   CREATE TABLE IF NOT EXISTS products (
     id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
     product VARCHAR(255) NOT NULL,
     variant VARCHAR(255) NOT NULL,
     SKU VARCHAR(32) NOT NULL
 );`;