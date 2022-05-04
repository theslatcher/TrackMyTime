const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const User = require('../models/user');
const jwt = require("jsonwebtoken");

async function hashPassword(password) {
	return new Promise( (resolve, reject) => {
		const salt = crypto.randomBytes(64).toString('base64');
		const iterations = 100000;
		const hashBytes = 64;
		crypto.pbkdf2(password, salt, iterations, hashBytes, 'sha256', (err, hash) => {
			if (err)
				return reject(err);

			resolve(salt + ":" + hash.toString('base64'));
		});
	});
}

async function verifyPassword(hashedPassword, password) {
	return new Promise( (resolve, reject) => {
		const salt = hashedPassword.substring(0,88);
		const iterations = 100000;
		const hashBytes = 64;
		crypto.pbkdf2(password, salt, iterations, hashBytes, 'sha256', (err, hash) => {
			if (err)
				return reject(err);

			resolve(hash.toString('base64') == hashedPassword.substring(89));
		});
	});
}

passport.use(new LocalStrategy((username, password, done) => {
  return User.findOne({where: {username: username}})
	.then(async (response) => {
        if (!response) {
			return done(null, false, {message: 'Incorrect username or password 5.'}); 
		}

		validPassword = await verifyPassword(response.password, password);

		if (validPassword)
			return done(null, {username: response.username, first_name: response.first_name,
						last_name: response.last_name, email: response.email});
		else
			return done(null, false, {message: 'Incorrect username or password.'});
    })
	.catch(err => {
        return done(err);
    });
}));

passport.serializeUser(function(user, done) {
	done(null, { username: user.username });
});

passport.deserializeUser(function(user, done) {
	User.findOne({attributes: ['username', 'first_name', 'last_name', 'email'], where: {username: user.username}})
	.then(response => {
        return done(null, response);
    })
	.catch(err => {
        return done(err);
    });
});

router.post('/signup', async (req, res) => {
	if (req.body.password)
			req.body.password = await hashPassword(req.body.password);

	User.create(req.body)
		.then(response => {
			res.status(200).json({message: 'Success!'});
		})
		.catch(err => {
			console.log(err);
			res.status(409).json({err: err});
		});
});

router.post('/login', passport.authenticate('local'), async (req, res) => {
	res.cookie("user_details", jwt.sign({user: req.user}, process.env.JWTSecret));
	res.redirect('/');
}); 

router.get('/signout', async (req, res) => {
	req.logOut();
	res.clearCookie("user_details");
	res.redirect('/');
});

router.get('/', async (req, res) => {
	//MW: Should all info be included?
	User.findAll({attributes: ['username', 'first_name', 'last_name', 'email']})
		.then(response => {
			res.status(200).send(response);
		});
});

router.get('/:username', async (req, res) => {
	//MW: Only admin, and the user itself, should be able to get this info.
	User.findOne({attributes: ['username', 'first_name', 'last_name', 'email'], where: {username: req.params.username}})
		.then(response => {
			res.status(200).send(response);
		});
});

router.delete('/:username', async (req, res) => {
	//MW: Should check to see if the correct user is sending the request.
	User.destroy({where: {username: req.params.username}})
		.then(response => {
			console.log(JSON.stringify(response));
			res.status(200).send({message: "Success!"});
		}).catch(err => {
			console.log(err);
			res.status(404).send({error: err});
		});
});

module.exports = router;