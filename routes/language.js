var express = require('express')
var router = express.Router()

router.get('/', (req, res, next) => {
    res.type('json').status(200).send({
        languagesList: [
            'Javascript',
            'Typescript'
        ]
    })
})

module.exports = router