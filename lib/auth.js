const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const User = require('../models/user');
const Sequelize = require('sequelize');

async function hashPassword(password) {
	return new Promise((resolve, reject) => {
		const salt = crypto.randomBytes(64).toString('base64');
		const iterations = 100000;
		const hashBytes = 64;
		crypto.pbkdf2(password, salt, iterations, hashBytes, 'sha256', (err, hash) => {
			if (err)
				return reject(err);

			resolve(salt + ':' + hash.toString('base64'));
		});
	});
}

async function verifyPassword(hashedPassword, password) {
	return new Promise((resolve, reject) => {
		const salt = hashedPassword.substring(0, 88);
		const iterations = 100000;
		const hashBytes = 64;
		crypto.pbkdf2(password, salt, iterations, hashBytes, 'sha256', (err, hash) => {
			if (err)
				return reject(err);

			resolve(hash.toString('base64') == hashedPassword.substring(89));
		});
	});
}

const invalidCredsMessage = 'Incorrect username or password.';

passport.use(new LocalStrategy((username, password, done) => {
	return User.findOne({
		where: Sequelize.where(
			Sequelize.fn('lower', Sequelize.col('username')),
			Sequelize.fn('lower', username)
		)
	})
		.then(async (response) => {
			if (!response) {
				return done(null, false, invalidCredsMessage);
			}

			validPassword = await verifyPassword(response.password, password);

			if (validPassword)
				return done(null, {
					userId: response.userId, username: response.username, first_name: response.first_name,
					last_name: response.last_name, email: response.email, is_admin: response.username === 'admin'
				});
			else
				return done(null, false, invalidCredsMessage);
		})
		.catch(err => {
			return done(err);
		});
}));

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (user, done) {
	User.findOne({ attributes: ['userId', 'username', 'first_name', 'last_name', 'email'], where: { userId: user.userId } })
		.then(response => {
			response.is_admin = response.username === 'admin';

			return done(null, response);
		})
		.catch(err => {
			return done(err);
		});
});

async function requireLoggedIn(req, res, next) {
	if (req.user)
		return next();
	return res.status(403).send({error: new Error('Forbidden Access.')});
}

module.exports = {
	authenticate: passport.authenticate('local'),
	hash_password: hashPassword,
	verify_password: verifyPassword,
	require_logged_in: requireLoggedIn
};