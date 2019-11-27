const express = require('express')
const uuid = require('uuid/v4')
const DiapersRouter = express.Router()
const bodyParser = express.json()
const DiapersService = require('./diapers-service.js')
const jsonParser = express.json()
const xss = require('xss')
const path = require('path')
var jwt = require('jsonwebtoken');




DiapersRouter.use( '/:token',(req, res, next) => {
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

DiapersRouter
    .route('/:token')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        DiapersService.getByUserId(knexInstance, req.user.id)
            .then(diapers => {
                res.json(diapers)
            })
            .catch(next);
    })
    .post(bodyParser, (req, res, next) => {
        const diaperdate = req.body.diaperdate;
        const diapertime = req.body.diapertime;
        const diapertype = req.body.diapertype;
        if (!diaperdate) {
            return res
                .status(400)
                .json({ error: { message: 'Missing "diaperDate" in request body' } });
        }
        if (!diapertime) {
            return res
                .status(400)
                .json({ error: { message: 'Missing "diaperDate" in request body' } });
        }
        if (!diapertype) {
            return res
                .status(400)
                .json({ error: { message: 'Missing "diaperType" in request body' } });
        }



        const newDiaper = {
            diaperdate,
            diapertime,
            diapertype,
            userid: req.user.id
        };
        DiapersService.insertDiaper(req.app.get('db'), newDiaper)
            .then(Diaper => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${Diaper.id}`))
                    .json(Diaper)
            })
            .catch(next)
    })

DiapersRouter
    .route('/:token/:id')
    .all((req, res, next) => {
        DiapersService.getById(
            req.app.get('db'),
            req.params.id
        )
            .then(diaper => {
                if (!diaper) {
                    return res.status(404).json({
                        error: { message: `Diaper with id ${req.params.id} not found.` }
                    })
                }
                res.diaper = diaper
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {

        res.json({
            id: res.diaper.id,
            diaperDate: xss(res.diaper.diaperdate),
            diaperTime: xss(res.diaper.diapertime), // sanitize title
            diaperType: xss(res.diaper.diapertype), // sanitize content
        })
    })

    .delete((req, res, next) => {
        DiapersService.deleteDiaper(
            req.app.get('db'),
            req.params.id)
            .then(() => {
                res
                    .status(204)
                    .end();
            })

    })

    .patch(jsonParser, (req, res, next) => {
        const { diapertime, diaperdate, diapertype } = req.body
        const diaperToUpdate = { diapertime, diaperdate, diapertype }

        const numberOfValues = Object.values(diaperToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain either 'diaperTime', 'diaperDate' or 'diaperType'`
                }
            })
        }

        DiapersService.updateDiaper(
            req.app.get('db'),
            req.params.id,
            diaperToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = DiapersRouter