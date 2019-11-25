const express = require('express')
const uuid = require('uuid/v4')
const UserRouter = express.Router()
const bodyParser = express.json()
const UserService = require('./UserService.js')
const jsonParser = express.json()
const xss = require('xss')
const path = require('path')
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');





UserRouter
    .route('/login')
    .post(bodyParser,(req, res, next) => {
        //check if user exists
        UserService.getByEmail(req.app.get('db'), req.body.email)
            .then(user => {
                //if user doesnt exist
                if (!user) {
                    res.status(401).json({
                        message: 'user does not exist'
                    })
                    return
                }

                if (!bcrypt.compareSync(req.body.userpassword, user.userpassword)) {
                    res.status(401).json({
                        message: 'password does not match'
                    })
                    return
                }
                const userToken = {
                    email: user.email,
                    id: user.id,
                    date: Date.now()
                }
                var token = jwt.sign(userToken, 'shhhhh');
                res.json(token)
            })
    })

UserRouter
    .route('/register')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        UserService.getAllUser(knexInstance)
            .then(user => {
                res.json(user)
            })
            .catch(next);
    })

    .post(bodyParser, (req, res, next) => {
        //check if user exists
        UserService.getByEmail(req.app.get('db'), req.body.email)
            .then(user => {
                if (user) {
                    res.status(401).json({
                        message: 'user already exists'
                    })
                    return
                }

                //if user doesnt exist, create user

                //encrypt the password
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(req.body.userpassword, salt);

                const userToInsert = {
                    email: req.body.email,
                    userpassword: hash,
                }
                UserService.insertUser(req.app.get('db'), userToInsert)
                    .then(user => {
                        res
                            .status(201)
                            .location(path.posix.join(req.originalUrl, `/${user.id}`))
                            .json(user)
                    })
                    .catch(next);
            })
    })




module.exports = UserRouter