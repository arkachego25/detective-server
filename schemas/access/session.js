const Joi = require('joi')
const HTTPError = require('http-errors')

const sessionSchema = Joi.object().keys({
    emailAddress: Joi.string().max(100).email().required(),
    sessionToken: Joi.string().length(256).regex(/^[A-Za-z0-9]*$/).required()
})

const validateContent = (content) => {
    return new Promise((resolve, reject) => {
        Joi.validate(content, sessionSchema, (error) => error ? reject(HTTPError(400)) : resolve())
    })
}

module.exports.validateContent = validateContent