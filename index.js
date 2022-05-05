require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

app.use(function (req, res, next) {
	if (req.url != '/favicon.ico') {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Content-Type");
		res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
		return next();
	} else {
		res.status(200);
		res.header('Content-Type', 'image/x-icon');
		res.header('Cache-Control', 'max-age=4294880896');
		res.end();
	}
});

app.use(express.json());
app.use(require('body-parser').json());
app.use(require('cookie-parser')());
app.use(express.static('views'));

app.use(express.static('views'));

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

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

const task = require('./routes/task');
app.use('/task/', task);

const userRouter = require('./routes/user');
app.use('/user/', userRouter);

const timeRouter = require('./routes/time');
app.use('/time/', timeRouter);

app.get('/', (req, res) => {
	if (req.isAuthenticated())
		res.sendFile(path.join(__dirname, '/views/html/tracker_page.html'));
	else
		res.sendFile(path.join(__dirname, '/views/html/homepage.html'));
});

app.listen(port, () => console.log(`Running on ${port}!`));