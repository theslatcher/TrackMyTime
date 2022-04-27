const express = require("express")
const router = express.Router()
const db = require("../db")

router.post("/", async (req, res) => {
    await db.query('INSERT INTO "TrackerTask"(name, color, goal, currenttime, username) VALUES($1, $2, $3, 0, $4);', 
    [req.body.name, req.body.color, req.body.goal, req.body.username]).then(response => {
        res.status(200)
        res.send("Success!")
    }).catch(err => {
        res.status(409),
        res.send({err: err.detail})
    })
})

router.delete("/", async (req, res) => {
    await db.query('DELETE FROM "TrackerTask" WHERE name=$1', [req.body.name]).then(response => {
        res.status(200)
        res.send("Success!")
    }).catch(err => {
        res.status(409)
        res.send({err: err.detail})
    })
})

router.get("/", async (req, res) => {
    await db.query('SELECT * FROM "TrackerTask"').then(response => {
        res.status(200)
        res.send(response.rows)
    }).catch(err => {
        res.status(404)
        res.send({err: err.detail})
    })
})

router.get("/:id", async (req, res) => {
    await db.query('SELECT * FROM "TrackerTask" WHERE trackerid=$1', [req.params.id]).then(response => {
        if(response.rowCount > 0){
            res.status(200)
            res.send(response.rows)
        }else{
            res.status(404)
            res.send({error: "Task was not found!"})
        }
    }).catch(err => {
        res.status(404)
        res.status({err: err.detail})
    })
})

router.put("/:id", async (req, res) => {
    await db.query('UPDATE "TrackerTask" SET name = $1, color = $2, goal = $3 WHERE trackerid=$4', 
    [req.body.name, req.body.color, req.body.goal, req.params.id]).then(response => {
        res.status(200)
        res.send("Success!")
    })
})



module.exports = router