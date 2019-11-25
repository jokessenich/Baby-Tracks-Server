const express = require('express')
const uuid = require('uuid/v4')
const NursingRouter = express.Router()
const bodyParser = express.json()
const NursingService = require('./nursing-service.js')
const jsonParser = express.json()
const xss = require('xss')
const path = require('path')
var jwt = require('jsonwebtoken');




NursingRouter.use( '/:token',(req, res, next) => {
    console.log('middleware')
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

NursingRouter
    .route('/:token')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        NursingService.getByUserId(knexInstance, req.user.id)
            .then(nursing => {
                res.json(nursing)
            })
            .catch(next);
    })
    .post(bodyParser, (req, res, next) => {
        const starttime = req.body.starttime;
        const endtime = req.body.endtime;
        const duration = req.body.duration;
        const rightside = req.body.rightside;
        const leftside = req.body.leftside;

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



        const newNursing = {
            starttime,
            endtime,
            duration,
            rightside,
            leftside,
            userid: req.user.id
        };
        console.log(newNursing)

        NursingService.insertNursing(req.app.get('db'), newNursing)
            .then(nursing => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${nursing.id}`))
                    .json(nursing)
            })
            .catch(next)
    })

NursingRouter
    .route('/:token/:id')
    .all((req, res, next) => {
        NursingService.getById(
            req.app.get('db'),
            req.params.id
        )
            .then(nursing => {
                if (!nursing) {
                    return res.status(404).json({
                        error: { message: `Nursing with id ${req.params.id} not found.` }
                    })
                }
                res.nursing = nursing
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {

        res.json({
            id: res.nursing.id,
            starttime: xss(res.nursing.starttime),
            endtime: xss(res.nursing.endtime), // sanitize title
            duration: xss(res.nursing.duration), // sanitize content
            rightside: xss(res.nursing.rightside),
            leftside: xss(res.nursing.leftside)
        })
    })

    .delete((req, res, next) => {
        NursingService.deleteNursing(
            req.app.get('db'),
            req.params.id)
            .then(() => {
                res
                    .status(204)
                    .end();
            })

    })

    .patch(jsonParser, (req, res, next) => {
        const { starttime, endtime, duration, rightside, leftside } = req.body
        const nursingToUpdate = { starttime, endtime, duration, rightside, leftside }

        const numberOfValues = Object.values(nursingToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain either 'starttime', 'endtime', 'duration', 'rightside', or 'leftside'`
                }
            })
        }

        NursingService.updateNursing(
            req.app.get('db'),
            req.params.id,
            nursingToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = NursingRouter