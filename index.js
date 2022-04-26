require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(require('body-parser').json());
app.use(require('cookie-parser')());

const passport = require('passport');
app.use(require('express-session')({ 
	secret: process.env.SessionSecret,
	resave: false,
	saveUninitialized: false,
	cookie: { 
		expires: false,
		secure: false, //HTTPS-only
		httpOnly: false,
		sameSite: 'strict'
	}
}));
app.use(passport.initialize());
app.use(passport.session());

const task = require('./routes/task');
app.use('/', task);

const userRouter = require('./routes/user');
app.use('/user/', userRouter);

const timeRouter = require('./routes/time');
app.use('/time/', timeRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => console.log(`Running on ${port}!`));