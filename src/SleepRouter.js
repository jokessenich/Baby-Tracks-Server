const express = require('express')
const uuid = require('uuid/v4')
const SleepRouter = express.Router()
const bodyParser = express.json()
const SleepService = require('./sleep-service.js')
const jsonParser = express.json()
const xss = require('xss')
const path = require('path')
var jwt = require('jsonwebtoken');




SleepRouter.use( '/:token',(req, res, next) => {
    const token = req.params.token
    if (!token) {
        res.status(401).json({ error: { message: "missing token" } })
        return
    }
    jwt.verify(req.params.token, 'shhhhh', (error, decodedObject) => {
        if (error) {
            res.status(401).json({ error: { message: "invalid token" } })
            return
        }
        // token is valid, we have the user object
        req.user=decodedObject;
        next()
    })
})

SleepRouter
    .route('/:token')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        SleepService.getByUserId(knexInstance, req.user.id)
            .then(Sleep => {
                res.json(Sleep)
            })
            .catch(next);
    })
    .post(bodyParser, (req, res, next) => {
        
        const starttime = req.body.starttime;
        const endtime = req.body.endtime;
        const duration = req.body.duration;

        if (!starttime) {
            return res
                .status(400)
                .json({ error: { message: 'Missing "starttime" in request body' } });
        }
        if (!endtime) {
            return res
                .status(400)
                .json({ error: { message: 'Missing "endtime" in request body' } });
        }
        if (!duration) {
            return res
                .status(400)
                .json({ error: { message: 'Missing "duration" in request body' } });
        }



        const newSleep = {
            starttime,
            endtime,
            duration,
            userid: req.user.id

        };

        SleepService.insertSleep(req.app.get('db'), newSleep)
            .then(sleep => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${sleep.id}`))
                    .json(sleep)
            })
            .catch(next)
    })

SleepRouter
    .route('/:token/:id')
    .all((req, res, next) => {
        SleepService.getById(
            req.app.get('db'),
            req.params.id
        )
            .then(sleep => {
                if (!sleep) {
                    return res.status(404).json({
                        error: { message: `Sleep with id ${req.params.id} not found.` }
                    })
                }
                res.sleep = sleep
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {

        res.json({
            id: res.sleep.id,
            starttime: xss(res.sleep.starttime),
            endtime: xss(res.sleep.endtime), // sanitize title
            duration: xss(res.sleep.duration), // sanitize content
        })
    })

    .delete((req, res, next) => {
        SleepService.deleteSleep(
            req.app.get('db'),
            req.params.id)
            .then(() => {
                res
                    .status(204)
                    .end();
            })

    })

    .patch(jsonParser, (req, res, next) => {
        const { starttime, endtime, duration } = req.body
        const SleepToUpdate = { starttime, endtime, duration }

        const numberOfValues = Object.values(SleepToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain either 'starttime', 'endtime', or 'duration'`
                }
            })
        }

        SleepService.updateSleep(
            req.app.get('db'),
            req.params.id,
            SleepToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = SleepRouter