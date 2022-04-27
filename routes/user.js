const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const Users = require('../models/users');
const db = require('../db');

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
  return Users.findOne({where: {username: username}})
	.then(async (response) => {
        if (!response || response.length == 0) {
			return done(null, false, {message: 'Incorrect username or password 5.'}); 
		}

		validPassword = await verifyPassword(response.rows[0].password, password);

		if (validPassword)
			return done(null, response.rows[0]);
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
	Users.findOne({where: {username: user.username}})
	.then(response => {
        return done(null, response);
    })
	.catch(err => {
        return done(err);
    });
});

router.post('/signup', async (req, res) => {
	if(!req.body || !req.body.username || !req.body.password || !req.body.first_name || !req.body.last_name || !req.body.email) {
		res.status(422).json({error: 'Must provide all fields.'});
	} else {
		req.body.password = await hashPassword(req.body.password);

		await Users.create(req.body)
			.then(response => {
				res.status(200).json({message: 'Success!'});
			})
			.catch(err => {
				res.status(409).json({err: err.detail});
			});
	}
});

router.post('/login', passport.authenticate('local'), async (req, res) => {
	res.redirect('/');
}); 

router.get('/signout', async (req, res) => {
	req.logOut();
	res.redirect('/');
});

module.exports = router;