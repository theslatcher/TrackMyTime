require("dotenv").config()
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())

const task = require('./routes/task');
app.use("/", task)

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => console.log(`Running on ${port}!`));