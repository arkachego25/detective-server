var executor = require('fawn')
var database = require('./database')

executor.init(database, 'executor')

module.exports  = executor