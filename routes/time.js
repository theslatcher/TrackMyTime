const TrackerTime = require('../models/trackerTime');
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
  await TrackerTime.findAll({ where: { trackerid: req.params.id } })
    .then((response) => {
      // sort by date
      response.sort((b, a) => {
        return new Date(a.dayofyear) - new Date(b.dayofyear);
      });
      res.status(200);
      res.send(response);
    })
    .catch((err) => console.log(err));
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
