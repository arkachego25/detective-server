var chai = require('chai')
var server = require('../app')
var assert = chai.assert
chai.use(require('chai-http'))

var emailAddress = 'sample@domain.com'
var loginPassword = 'sample01'
var sessionToken

describe('Login API', () => {

    it('should log the user as valid and correct request attributes have been passed', (done) => {
        chai.request(server).post('/access/login')
        .send({
            emailAddress: emailAddress,
            loginPassword: loginPassword
        })
        .end((error, response) => {
            if (error) {
                console.log(error)
            }
            else {
                assert.equal(response.status, 200)
                sessionToken = response.headers['session-token']
            }
            done()
        })
    })

})

describe('Language API', () => {

    it('should return an array of supported programming/scripting languages', (done) => {
        chai.request(server).get('/language')
        .set({ 'session-token': sessionToken })
        .end((error, response) => {
            if (error) {
                console.log(error)
            }
            else {
                assert.equal(response.status, 200)
                response = JSON.parse(response.text)
                assert.containsAllKeys(response, 'languagesList')
                assert.deepEqual(response.languagesList, [ 'Javascript', 'Typescript' ])
            }
            done()
        })
    })

})

describe('Logout API', () => {

    it('should log the user out from the application after clicking on the logout button', (done) => {
        chai.request(server).head('/access/logout')
        .set({ 'session-token': sessionToken })
        .end((error, response) => {
            if (error) {
                console.log(error)
            }
            else {
                assert.equal(response.status, 204)
            }
            done()
        })
    })

})