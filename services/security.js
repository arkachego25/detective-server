var crypto = require('crypto')
var randomise = require('randomatic')
var HTTPError = require('http-errors')
var key = 'S59uWHvWeSmkL72T8FIYniNf58gYTuLK'

const digestPassword = (password) => {
    return new Promise((resolve, reject) => {
        try {
            let engine = crypto.createHash('sha512')
            engine.update(password, 'utf8')
            resolve(engine.digest('hex'))
        }
        catch (error) {
            console.log(error)
            reject(HTTPError(500))
        }
    })
}

const encryptSession = (session) => {
    return new Promise((resolve, reject) => {
        try {
            let cipher = crypto.createCipher('aes192', key)
            session = cipher.update(JSON.stringify(session), 'utf8', 'hex')
            session += cipher.final('hex')
            resolve(session)
        }
        catch (error) {
            console.log(error)
            reject(HTTPError(500))
        }
    })
}

const decryptSession = (session) => {
    return new Promise((resolve, reject) => {
        try {
            let decipher = crypto.createDecipher('aes192', key)
            session = decipher.update(session, 'hex', 'utf8')
            session += decipher.final('utf8')
            resolve(JSON.parse(session))
        }
        catch (error) {
            if (error.name === 'TypeError') {
                reject(HTTPError(400))
            }
            else {
                console.log(error)
                reject(HTTPError(500))
            }
        }
    })
}

const generateString = (type, length) => {
    return new Promise((resolve) => resolve(randomise(type, length)))
}

module.exports.digestPassword = digestPassword
module.exports.encryptSession = encryptSession
module.exports.decryptSession = decryptSession
module.exports.generateString = generateString