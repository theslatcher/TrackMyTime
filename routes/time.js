const db = require("../db");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  await db
    .query('SELECT * FROM "TrackerTime"')
    .then((response) => {
      res.status(200).send(response.rows);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

router.get("/:id", async (req, res) => {
  await db
    .query('SELECT * FROM "TrackerTime" WHERE trackerid=$1', [req.params.id])
    .then((response) => {
      res.status(200).send(response.rows);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

router.post("/", async (req, res) => {
  await db
    .query(
      'INSERT INTO "TrackerTime"(dayofyear, totaltime, trackerid) VALUES($1, $2, $3);',
      [req.body.dayofyear, req.body.totaltime, req.body.trackerid]
    )
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
  await db
    .query('DELETE FROM "TrackerTime" WHERE trackerid=$1', [req.body.trackerid])
    .then((response) => {
      res.status(200).send(`Deleted ${response.rowCount} rows`);
    })
    .catch((err) => {
      res.status(409).send(err);
    });
});

router.put("/:id", async (req, res) => {
  await db
    .query(
      'UPDATE "TrackerTime" SET dayofyear = $1, totaltime = $2 WHERE trackerid=$3',
      [req.body.dayofyear, req.body.totaltime, req.params.id]
    )
    .then((response) => {
      res.status(200).send(`Updated ${response.rowCount} rows`);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

module.exports = router;
