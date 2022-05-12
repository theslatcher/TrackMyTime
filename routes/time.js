const TrackerTask = require('../models/trackerTask');
const TrackerTime = require('../models/trackerTime');
const { Op } = require("sequelize");
const express = require("express");
const router = express.Router();
const auth = require("../lib/auth");

router.get("/", auth.require_logged_in, async (req, res) => {
  let userIdQuery = {};

  if (!req.user.is_admin)
    userIdQuery['userId'] = req.user.userId;

  TrackerTime.findAll({include: { model: TrackerTask, as: 'TrackerTask', attributes: [], where: userIdQuery}})
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(404).send({error: err});
    });
});

router.get("/:id", auth.require_logged_in, async (req, res) => {
  let userIdQuery = {};

  if (!req.user.is_admin)
    userIdQuery['userId'] = req.user.userId;

  TrackerTime.findAll({where: {trackerid: req.params.id}, 
    include: { model: TrackerTask, as: 'TrackerTask', attributes: [], where: userIdQuery}})
    .then((response) => {
        response.sort((a, b) => {
          return new Date(a.dayofyear) - new Date(b.dayofyear);
        });
        res.status(200).send(response);
    })
    .catch((err) => {
      res.status(404).send({error: err});
    });
});

router.post("/", auth.require_logged_in, async (req, res) => {
  if (!req.user.is_admin)
  {
    let allowed = false;
    await TrackerTask.findOne({where: {trackerid: req.body.trackerid, userId: req.user.userId}})
      .then((response) => {
        if (response)
          allowed = true;
      })
      .catch((err) => {
        return res.status(404).send({error: err});
      });

      if (!allowed)
        return res.status(404).send({error: new Error('Not Found.')});
  }

  TrackerTime.create(req.body)
    .then((response) => {
      res
        .status(200)
        .send(`Added ${req.body.totaltime} to trackerid ${req.body.trackerid}`);
    })
    .catch((err) => {
      res.status(409).send({error: err});
    });
});

router.delete("/", auth.require_logged_in, async (req, res) => {
  let userIdQuery = {};

  if (!req.user.is_admin)
    userIdQuery['userId'] = req.user.userId;

  TrackerTime.destroy({where: {trackerid: req.body.trackerid}, 
    include: { model: TrackerTask, as: 'TrackerTask', attributes: [], where: userIdQuery}})
    .then((response) => {
      res.status(200).send(`Deleted ${response} rows`);
    })
    .catch((err) => {
      res.status(409).send({error: err});
    });
});

router.delete("/user/:userId", auth.require_logged_in, async (req, res) => {
  if (!((req.user.userId == req.params.userId) || req.user.is_admin))
    return res.status(403).send({error: new Error('Forbidden Access.')});

	TrackerTask.findAll({attributes: ['trackerid'], where: {userId: req.params.userId}})
		.then(async (response) => {
			const trackerids = response.map(elem => elem.trackerid);
			TrackerTime.destroy({where: {trackerid: {[Op.or]: trackerids}}})
				.then((deletedElems) => {
					res.status(200).send(`Deleted ${deletedElems} rows`);
				})
				.catch((err) => {
					res.status(409).send({error: err});
				});
				
		})
		.catch((err) => {
			res.status(409).send({error: err});
		});
});

router.put("/:id", auth.require_logged_in, async (req, res) => {
  let userIdQuery = {};

  if (!req.user.is_admin)
    userIdQuery['userId'] = req.user.userId;

  TrackerTime.update({dayofyear: req.body.dayofyear, totaltime: req.body.totaltime}, 
    {where: {trackerid: req.params.id},
    include: { model: TrackerTask, as: 'TrackerTask', attributes: [], where: userIdQuery}})
    .then((response) => {
      res.status(200).send(`Updated ${response.length} rows`);
    })
    .catch((err) => {
      res.status(404).send({error: err});
    });
});

module.exports = router;
