var express = require('express')
var router = express.Router()

// Schemas
var Session = require('../schemas/access/session')

// Services
var Security = require('../services/security')
var Access = require('../services/access')

router.use('/access', require('./access'))

router.use(async (req, res, next) => {
    try {
        if (req.headers['session-token'] === undefined) {
            res.sendStatus(400)
        }
        else {
            res.locals.accessToken = await Security.decryptSession(req.headers['session-token'])
            await Session.validateContent(res.locals.accessToken)
            await Access.performSession(res.locals.accessToken)
            next()
        }
    }
    catch (error) {
        switch (error.name) {
            case 'BadRequestError': {
                res.sendStatus(400)
                break
            }
            case 'ForbiddenError': {
                res.sendStatus(403)
                break
            }
            case 'NotFoundError': {
                res.sendStatus(404)
                break
            }
            default: {
                res.sendStatus(500)
                break
            }
        }
    }
})

router.use('/language', require('./language'))
router.use('/snippet', require('./snippet'))

module.exports = router