const express = require("express")
const router = express.Router()
const TrackerTask = require("../models/trackerTask")
const TrackerTime = require("../models/trackerTime")
const Sequelize = require("sequelize")
const dayjs = require("dayjs")
const { Op } = require("sequelize")

router.post("/", async (req, res) => {
    req.body.currenttime = 0;
    await TrackerTask.create(req.body).then(response => {
        res.status(200)
        res.send("Success!")
    }).catch(err => {
        res.status(409),
            res.send({ err: err.detail })
    })
})

router.delete("/", async (req, res) => {
    await TrackerTask.destroy({ where: { trackerid: req.body.trackerid } }).then(response => {
        res.status(200)
        res.send("Success!")
    }).catch(err => {
        res.status(409)
        res.send({ err: err.detail })
    })
})

router.get("/", async (req, res) => {
    await TrackerTask.findAll().then(response => {
        res.status(200)
        res.send(response)
    }).catch(err => {
        res.status(404)
        res.send({ err: err.detail })
    })
})

function getDateQuery(query) {
    let dateQuery = {}

    if (query.d)
	{
        const day = dayjs(new Date(query.d))
        const start = day.startOf('day').format()
        const end = day.endOf('day').format()

		dateQuery = {
			dayofyear: {
				[Op.between]: [start, end]
			}
		}
	}
    else if (query.m)
    {
        const month = dayjs(new Date(query.m))
        const start = month.startOf('month').format()
        const end = month.endOf('month').format()

		dateQuery = {
			dayofyear: {
				[Op.between]: [start, end]
			}
		}
    }
    else if (query.y)
    {
        const year = dayjs(new Date(query.y))
        const start = year.startOf('year').format()
        const end = year.endOf('year').format()

		dateQuery = {
			dayofyear: {
				[Op.between]: [start, end]
			}
		}
    }

    return dateQuery
}

router.get("/:id", async (req, res) => {
	const dateQuery = getDateQuery(req.query)
	
    await TrackerTask.findOne({
        attributes: {
            include: [[Sequelize.fn("SUM", Sequelize.col("TrackerTime.totaltime")), "currenttime"]]
        },
        where: { trackerid: req.params.id },
        include: { model: TrackerTime, as: 'TrackerTime', attributes: [], where: dateQuery },
        group: ['TrackerTask.trackerid']
    })
        .then(response => {
            res.status(200)
            res.send(response)
        }).catch(err => {
            res.status(404)
            res.send({ err: err.detail })
        })
})

router.put("/:id", async (req, res) => {
    await TrackerTask.update({ name: req.body.name, color: req.body.color, goal: req.body.goal },
        { where: { trackerid: req.params.id } }).then(response => {
            res.status(200)
            res.send("Success!")
        })
})

router.delete("/user/:userId", async (req, res) => {
    //MW: Should check to see if the correct user is sending the request.
    TrackerTask.destroy({ where: { userId: req.params.userId } }).then(response => {
        res.sendStatus(200, response)
    }).catch(err => console.log(err))
})

router.get("/user/:userId", async (req, res) => {
    const dateQuery = getDateQuery(req.query)

    await TrackerTask.findAll(({
        attributes: {
            include: [[Sequelize.fn("SUM", Sequelize.col("TrackerTime.totaltime")), "currenttime"]]
        },
        where: { userId: req.params.userId },
        include: { model: TrackerTime, as: 'TrackerTime', attributes: [], where: dateQuery },
        group: ['TrackerTask.trackerid']
    })).then(response => {
        res.status(200)
        res.send(response)
    }).catch(err => console.log(err))
})


module.exports = router