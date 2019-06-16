const Joi = require('joi')
const HTTPError = require('http-errors')

const resetSchema = Joi.object().keys({
    emailAddress: Joi.string().max(100).email().required()
})

const validateContent = (content) => {
    return new Promise((resolve, reject) => {
        Joi.validate(content, resetSchema, (error) =>error ? reject(HTTPError(400)) : resolve())
    })
}

module.exports.validateContent = validateContent