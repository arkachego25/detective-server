const Joi = require('joi')
const HTTPError = require('http-errors')

const loginSchema = Joi.object().keys({
    emailAddress: Joi.string().max(100).email().required(),
    loginPassword: Joi.string().min(8).max(30).required()
})

const validateContent = (content) => {
    return new Promise((resolve, reject) => {
        Joi.validate(content, loginSchema, (error) =>error ? reject(HTTPError(400)) : resolve())
    })
}

module.exports.validateContent = validateContent