var express = require('express')
var router = express.Router()

// Services
const Snippet = require('../services/snippet')

router.get('/', async (req, res, next) => {
    try {
        let snippetsList = await Snippet.readSnippets(res.locals.accessToken)
        res.type('json').status(200).send({ snippetsList: snippetsList })
    }
    catch (error) {
        res.sendStatus(500)
    }
})

router.post('/', async (req, res, next) => {
    try {
        let snippet = await Snippet.createSnippet(res.locals.accessToken, req.body)
        res.type('json').status(201).send(snippet)
    }
    catch (error) {
        res.sendStatus(500)
    }
})

router.put('/', async (req, res, next) => {
    try {
        let snippet = await Snippet.updateSnippet(req.body)
        res.type('json').status(200).send(snippet)
    }
    catch (error) {
        res.sendStatus(500)
    }
})

module.exports = router