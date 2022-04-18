// Postgres module
var pg = require('pg');
var dotenv = require("dotenv")

dotenv.config()

// Database connection
var conString = process.env.DB_Connection
var client = new pg.Client(conString);
client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  
    console.log("Connected!");
})