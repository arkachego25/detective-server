var express = require('express')
var logger = require('morgan')
var cors = require('cors')
var bodyParser = require('body-parser')

var app = express()
app.use(logger('dev'))
app.use(cors({ exposedHeaders: [ 'session-token' ] }))
app.use(bodyParser.json())
app.use(require('./routes/master'))

module.exports = app