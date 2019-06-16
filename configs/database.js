var database = require('mongoose')

let dbUrl = 'mongodb://localhost:27017/detective'

database.connect(dbUrl, { useNewUrlParser: true })
database.connection.on('error', console.error.bind(console))

module.exports = database