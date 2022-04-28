const express = require("express")
const router = express.Router()
const TrackerTask = require("../models/trackerTask")

router.post("/task", async (req, res) => {
    req.body.currenttime = 0;
    await TrackerTask.create(req.body).then(response => {
        res.status(200)
        res.send("Success!")
    }).catch(err => {
        res.status(409),
        res.send({err: err.detail})
    })
})

router.delete("/task", async (req, res) => {
    await TrackerTask.destroy({where: {name: req.body.name}}).then(response => {
        res.status(200)
        res.send("Success!")
    }).catch(err => {
        res.status(409)
        res.send({err: err.detail})
    })
})

router.get("/task", async (req, res) => {
    await TrackerTask.findAll().then(response => {
        res.status(200)
        res.send(response)
    }).catch(err => {
        res.status(404)
        res.send({err: err.detail})
    })
})

router.get("/task/:id", async (req, res) => {
    await TrackerTask.findOne({where: {trackerid: req.params.id}}).then(response => {
        res.status(200)
        res.send(response)
    }).catch(err => {
        res.status(404)
        res.status({err: err.detail})
    })
})

router.put("/task/:id", async (req, res) => {
    await TrackerTask.update({name: req.body.name, color: req.body.color, goal: req.body.goal},
        {where: {trackerid: req.params.id}}).then(response => {
        res.status(200)
        res.send("Success!")
    })
})



module.exports = router