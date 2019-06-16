const Joi = require('joi')
const HTTPError = require('http-errors')

const registerSchema = Joi.object().keys({
    emailAddress: Joi.string().max(100).email().required(),
    loginPassword: Joi.string().min(8).max(30).required()
})

const validateContent = (content) => {
    return new Promise((resolve, reject) => {
        Joi.validate(content, registerSchema, (error) =>error ? reject(HTTPError(400)) : resolve())
    })
}

module.exports.validateContent = validateContent