const express = require("express")
const router = express.Router()
const TrackerTask = require("../models/trackerTask")
const TrackerTime = require("../models/trackerTime")
const Sequelize = require("sequelize")
const dayjs = require("dayjs")
dayjs.Ls.en.weekStart = 1; //might need to be placed someplace else if dayjs will be used elsewhere.
const { Op } = require("sequelize")
const auth = require("../lib/auth")

router.post("/", auth.require_logged_in, async (req, res) => {
    if (!req.user.is_admin)
        req.body.userId = req.user.userId;

    TrackerTask.create(req.body).then(response => {
        res.status(200)
        res.send({body: response.dataValues})
    }).catch(err => {res.send(409).send({error: err})})
})

router.delete("/", auth.require_logged_in, async (req, res) => {
    let whereStatement = { trackerid: req.body.trackerid }

    if (!req.user.is_admin)
        whereStatement["userId"] = req.user.userId

    TrackerTask.destroy({ where: whereStatement }).then(response => {
        res.status(200)
        res.send("Success!")
    }).catch(err => {
        res.status(409).send({ error: err })
    })
})

router.get("/", auth.require_logged_in, async (req, res) => {
    let whereStatement = {}

    if (!req.user.is_admin)
        whereStatement["userId"] = req.user.userId

    TrackerTask.findAll({where: whereStatement}).then(response => {
        res.status(200)
        res.send(response)
    }).catch(err => {res.send(409).send({error: err})})
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
    else if (query.w)
    {
        const week = dayjs(new Date(query.w))
        const start = week.startOf('week').format()
        const end = week.endOf('week').format()

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

router.get("/:id", auth.require_logged_in, async (req, res) => {
    let whereStatement = { trackerid: req.params.trackerid }

    if (!req.user.is_admin)
        whereStatement["userId"] = req.user.userId

	const dateQuery = getDateQuery(req.query)
	
    TrackerTask.findOne({
        attributes: {
            include: [[Sequelize.fn("SUM", Sequelize.col("TrackerTime.totaltime")), "currenttime"]]
        },
        where: whereStatement,
        include: { model: TrackerTime, as: 'TrackerTime', attributes: [], where: dateQuery },
        group: ['TrackerTask.trackerid']
    })
        .then(response => {
            res.status(200)
            res.send(response)
        }).catch(err => {res.send(404).send({error: err})})
})

router.put("/:id", auth.require_logged_in, async (req, res) => {
    let whereStatement = { trackerid: req.params.id };

    if (!req.user.is_admin)
        whereStatement["userId"] = req.user.userId;

    TrackerTask.update({ name: req.body.name, color: req.body.color, goal: req.body.goal },
        { where: whereStatement }).then(response => {
            res.status(200)
            res.send("Success!")
        }).catch(err => {res.send(409).send({error: err})})
})

router.delete("/user/:userId", auth.require_logged_in, async (req, res) => {
    if (!(req.user.is_admin || (req.user.userId == req.params.userId)))
        return res.status(403).send({error: new Error('Forbidden Access.')})

    TrackerTask.destroy({ where: { userId: req.params.userId } }).then(response => {
        res.sendStatus(200, response)
    }).catch(err => {res.send(409).send({error: err})})
})

router.get("/user/:userId", auth.require_logged_in, async (req, res) => {
    if (!(req.user.is_admin || (req.user.userId == req.params.userId)))
        return res.status(403).send({error: new Error('Forbidden Access')})

    const dateQuery = getDateQuery(req.query)

    TrackerTask.findAll(({
        attributes: {
            include: [[Sequelize.fn("SUM", Sequelize.col("TrackerTime.totaltime")), "currenttime"]]
        },
        where: { userId: req.params.userId },
        include: { model: TrackerTime, as: 'TrackerTime', attributes: [], where: dateQuery },
        group: ['TrackerTask.trackerid']
    })).then(response => {
        res.status(200)
        res.send(response)
    }).catch(err => {res.send(409).send({error: err})})
})


module.exports = router