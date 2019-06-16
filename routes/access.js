var express = require('express')
var router = express.Router()

// Schemas
var Register = require('../schemas/access/register')
var Login = require('../schemas/access/login')
var Session = require('../schemas/access/session')
var Reset = require('../schemas/access/reset')

// Services
var Security = require('../services/security')
var Access = require('../services/access')

router.post('/register', async (req, res, next) => {
    try {
        await Register.validateContent(req.body)
        req.body.loginPassword = await Security.digestPassword(req.body.loginPassword)
        await Access.performRegister(req.body)
        res.sendStatus(201)
    }
    catch (error) {
        switch (error.name) {
            case 'BadRequestError': {
                res.sendStatus(400)
                break
            }
            case 'ConflictError': {
                res.sendStatus(409)
                break
            }
            default: {
                res.sendStatus(500)
                break
            }
        }
    }
})

router.post('/login', async (req, res, next) => {
    try {
        await Login.validateContent(req.body)
        req.body.loginPassword = await Security.digestPassword(req.body.loginPassword)
        req.body.sessionToken = await Security.generateString('Aa0', 256)
        let accessToken = await Access.performLogin(req.body)
        res.set('session-token', await Security.encryptSession(accessToken))
        res.sendStatus(200)
    }
    catch (error) {
        switch (error.name) {
            case 'BadRequestError': {
                res.sendStatus(400)
                break
            }
            case 'UnauthorizedError': {
                res.sendStatus(401)
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

router.head('/logout', async (req, res, next) => {
    try {
        await Access.performLogout(res.locals.accessToken)
        res.sendStatus(204)
    }
    catch (error) {
        res.sendStatus(500)
    }
})

module.exports = router