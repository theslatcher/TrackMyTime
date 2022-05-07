const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');

async function hashPassword(password) {
	return new Promise( (resolve, reject) => {
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

const invalidCredsMessage = 'Incorrect username or password.';

passport.use(new LocalStrategy((username, password, done) => {
  return User.findOne({where: Sequelize.where(
		Sequelize.fn('lower', Sequelize.col('username')), 
		Sequelize.fn('lower', username)
  	)})
	.then(async (response) => {
        if (!response) {
			return done(null, false, invalidCredsMessage); 
		}

		validPassword = await verifyPassword(response.password, password);

		if (validPassword)
			return done(null, {userId: response.userId, username: response.username, first_name: response.first_name,
						last_name: response.last_name, email: response.email, is_admin: response.username === 'admin'});
		else
			return done(null, false, invalidCredsMessage);
    })
	.catch(err => {
        return done(err);
    });
}));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	User.findOne({attributes: ['userId', 'username', 'first_name', 'last_name', 'email'], where: {userId: user.userId}})
	.then(response => {
		response.is_admin = response.username === 'admin';

        return done(null, response);
    })
	.catch(err => {
        return done(err);
    });
});

router.post('/signup', async (req, res) => {
	if (req.body.password)
			req.body.password = await hashPassword(req.body.password);

	await User.create(req.body)
		.then(response => {
			res.status(200).json('Success!');
		})
		.catch(err => {
			res.status(409).json({error: err});
		});
});

router.post('/login', passport.authenticate('local'), async (req, res) => {
	res.cookie('user_details', jwt.sign({user: req.user}, process.env.JWTSecret));
	res.status(200).send('Success!');
}); 

router.get('/signout', async (req, res) => {
	req.logOut();
	res.clearCookie('user_details');
	res.status(200).send('Success!');
});

router.get('/', async (req, res) => {
	let user_attributes = ['userId', 'username'];

	if (req.user && req.user.is_admin)
		user_attributes.push('first_name', 'last_name', 'email');

	User.findAll({attributes: user_attributes})
		.then(response => {
			res.status(200).send(response);
		})
		.catch(err => {
			console.log(err);
			res.status(404).send({error: err});
		});
});

router.get('/:userId', async (req, res) => {
	let user_attributes = ['userId', 'username'];

	if (req.user && (req.user.is_admin || (req.user.userId == req.params.userId)))
		user_attributes.push('first_name', 'last_name', 'email');

	User.findOne({attributes: user_attributes, where:{userId: req.params.userId}})
		.then(response => {
			res.status(200).send(response);
		})
		.catch(err => {
			console.log(err);
			res.status(404).send({error: err});
		});
});

router.delete('/:userId', async (req, res) => {
	if (req.user && (req.user.is_admin || (req.user.userId == req.params.userId)))
	{
		User.findOne({where: {userId : req.params.userId}})
			.then(async (response) => {
				if (response.username === 'admin')
					return res.status(409).send({error: new Error('Cannot delete admin users.')});

				let allowed = req.user.is_admin;

				if (!allowed && req.body.password)
					allowed = await verifyPassword(response.password, req.body.password);

				if (!allowed)
					return res.status(409).send({error: new Error('Cannot delete your account without providing password.')});

				User.destroy({where:{userId: req.params.userId}})
					.then(response => {
						res.status(200).send({message: 'Success!'});
					})
					.catch(err => {
						console.log(err);
						res.status(404).send({error: err});
					});
			})
			.catch(err => {
				console.log(err);
				res.status(404).send({error: err});
			});
	}
	else
		res.status(409).send({error: new Error('Denied access.')});
});

router.put('/:userId', async (req, res) => {
	const admin_request = (req.user && req.user.is_admin);

	if (!admin_request && !req.body.curr_password)
		return res.status(409).send({error: new Error('Invalid password!')});

	User.findOne({where: {userId : req.params.userId}})
		.then(async (response) => {
			if (admin_request || await verifyPassword(response.password, req.body.curr_password))
			{
				let update_fields = {};

				if (req.body.username)
					update_fields['username'] = req.body.username;

				if (req.body.first_name)
					update_fields['first_name'] = req.body.first_name;

				if (req.body.last_name)
					update_fields['last_name'] = req.body.last_name;

				if (req.body.email)
					update_fields['email'] = req.body.email;

				if (req.body.new_password)
					update_fields['password'] = await hashPassword(req.body.new_password);

				User.update(update_fields, {where:{userId: req.params.userId}})
					.then(response => {
						res.status(200).send('Success!');
					})
					.catch(err => {
						res.status(409).send({error: err});
					});
			}
			else
				res.status(409).send({error: new Error('Invalid password!')});
		})
		.catch (err => {
			res.status(409).send({error: err});
		});
});

module.exports = router;