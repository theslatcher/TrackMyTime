// Postgres module
var pg = require('pg');
require("dotenv").config()
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;


// Database connection
var conString = process.env.DB_Connection
var client = new pg.Client(conString);
client.connect(function(err) {
  if(err) {
    return console.error('Could not connect to postgres', err);
  }
    console.log("Connected!");
})

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => console.log(`Running on ${port}!`));