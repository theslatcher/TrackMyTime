const TrackerTask = require('../models/trackerTask');
const TrackerTime = require('../models/trackerTime');
const { Op } = require("sequelize");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  await TrackerTime.findAll()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

router.get("/:id", async (req, res) => {
  await TrackerTime.findOne({where: {trackerid: req.params.id}})
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

router.post("/", async (req, res) => {
  await TrackerTime.create(req.body)
    .then((response) => {
      res
        .status(200)
        .send(`Added ${req.body.totaltime} to trackerid ${req.body.trackerid}`);
    })
    .catch((err) => {
      res.status(409).send(err);
    });
});

router.delete("/", async (req, res) => {
  await TrackerTime.destroy({where: {trackerid: req.body.trackerid}})
    .then((response) => {
      res.status(200).send(`Deleted ${response} rows`);
    })
    .catch((err) => {
      res.status(409).send(err);
    });
});

router.delete("/user/:userId", async (req, res) => {
	//MW: Should check to see if the correct user is sending the request.
	await TrackerTask.findAll({attributes: ['trackerid'], where: {userId: req.params.userId}})
		.then(async (response) => {
			const trackerids = response.map(elem => elem.trackerid);
			await TrackerTime.destroy({where: {trackerid: {[Op.or]: trackerids}}})
				.then((deletedElems) => {
					res.status(200).send(`Deleted ${deletedElems} rows`);
				})
				.catch((err) => {
					res.status(409).send(err);
				});
				
		})
		.catch((err) => {
			res.status(409).send(err);
		});    
});

router.put("/:id", async (req, res) => {
  await TrackerTime.update({dayofyear: req.body.dayofyear, totaltime: req.body.totaltime}, 
    {where: {trackerid: req.params.id}})
    .then((response) => {
      res.status(200).send(`Updated ${response.length} rows`);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

module.exports = router;
