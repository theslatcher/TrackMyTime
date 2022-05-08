const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const auth = require('../lib/auth');

router.post('/signup', async (req, res) => {
	if (req.body.password)
		req.body.password = await auth.hash_password(req.body.password);

	await User.create(req.body)
		.then(response => {
			res.status(200).json('Success!');
		})
		.catch(err => {
			res.status(409).json({error: err});
		});
});

router.post('/login', auth.authenticate, async (req, res) => {
	res.cookie('user_details', jwt.sign({user: req.user}, process.env.JWTSecret));
	
	req.session.save(function() {             
        return res.status(200).send('Success!');
    });
}); 

router.get('/signout', async (req, res) => {
	req.logOut();
	res.clearCookie('user_details');
	
	req.session.save(function() {             
        return res.status(200).send('Success!');
    });
});

router.get('/', async (req, res) => {
	const page_size = 10;
	const page = req.query.p || req.query.page || 1;

	let user_attributes = ['userId', 'username'];

	if (req.user && req.user.is_admin)
		user_attributes.push('first_name', 'last_name', 'email');

	User.findAll({attributes: user_attributes, offset: ((page-1)*page_size), limit: page_size})
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
					allowed = await auth.verify_password(response.password, req.body.password);

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
			if (admin_request || await auth.verify_password(response.password, req.body.curr_password))
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
					update_fields['password'] = await auth.hash_password(req.body.new_password);

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