require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const {CLIENT_ORIGIN} = require('./config')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const DiapersRouter = require('./DiapersRouter')
const NursingRouter = require('./NursingRouter')
const SleepRouter = require('./SleepRouter')
const UserRouter = require('./UserRouter')

const app = express()

const morganOption = (NODE_ENV === 'production')  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors({
    origin: CLIENT_ORIGIN
}))

app.get('/', (req, res)=> {
    res.send('Hello, world!')
})

app.use('/api/diapers', DiapersRouter)
app.use('/api/nursing', NursingRouter)
app.use('/api/sleep', SleepRouter)
app.use('/api/user', UserRouter)

 app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {       response = { error: { message: 'server error' } }
    } else {
     console.error(error)
     response = { message: error.message, error }
    }
    res.status(500).json(response)
    })

module.exports = app