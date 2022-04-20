const express = require("express")
const router = express.Router()
const db = require("../db")

router.post("/task", async (req, res) => {
    await db.query('INSERT INTO "TrackerTask"(name, color, goal, currenttime, username) VALUES($1, $2, $3, 0, $4);', 
    [req.body.name, req.body.color, req.body.goal, req.body.username]).then(response => {
        res.status(200)
        res.send("Success!")
    }).catch(err => {
        res.status(409),
        res.send({err: err.detail})
    })
})

router.delete("/task", async (req, res) => {
    await db.query('DELETE FROM "TrackerTask" WHERE name=$1', [req.body.name]).then(response => {
        res.status(200)
        res.send("Success!")
    }).catch(err => {
        res.status(409)
        res.send({err: err.detail})
    })
})



module.exports = router