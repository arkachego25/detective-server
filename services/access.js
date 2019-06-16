var HTTPError = require('http-errors')

// Models
var Profile = require('../models/profile')

const performRegister = (data) => {
    return new Promise((resolve, reject) => {
        Profile.insertMany([{
            profileEmail:           data.emailAddress,
            profilePasswords:       [ data.loginPassword ],
            profileAttempts:        [],
            profileSessions:        [],
            profileCounter:         1
        }], (error) => {
            if (error) {
                if (error.name === 'BulkWriteError') {
                    reject(HTTPError(409))
                }
                else {
                    reject(HTTPError(500))
                }
            }
            else {
                resolve()
            }
        })
    })
}

const performLogin = (data) => {
    return new Promise((resolve, reject) => {
        Profile.findOne({ profileEmail: data.emailAddress }, { _id: 0, __v: 0 }, { lean: true }, (error, profile) => {
            if (error) {
                console.log(error)
                reject(HTTPError(500))
            }
            else if (profile === null) {
                reject(HTTPError(404))
            }
            else {
                let passwordMatched = (data.loginPassword === profile.profilePasswords[0])
                profile.profileAttempts.unshift({
                    attemptStamp: new Date(),
                    attemptDecision: (passwordMatched && !profile.profileBlocked) ? 'Approved' : 'Declined'
                })
                if (profile.profileAttempts.length === 6) {
                    profile.profileAttempts.splice(-1, 1)
                }
                let sessionToken = {
                    emailAddress: data.emailAddress,
                    sessionToken: data.sessionToken
                }
                if (profile.profileAttempts[0].attemptDecision === 'Approved') {
                    profile.profileSessions.push(sessionToken.sessionToken)
                }
                Profile.updateOne({ profileEmail: data.emailAddress }, {
                    $set: {
                        profileAttempts: profile.profileAttempts,
                        profileSessions: profile.profileSessions
                    }
                }, (error) => {
                    if (error) {
                        console.log(error)
                        reject(HTTPError(500))
                    }
                    else if (passwordMatched) {
                        resolve(sessionToken)
                    }
                    else {
                        reject(HTTPError(401))
                    }
                })
            }
        })
    })
}

const performSession = (data) => {
    return new Promise((resolve, reject) => {
        Profile.findOne({ profileEmail: data.emailAddress }, (error, profile) => {
            if (error) {
                console.log(error)
                reject(HTTPError(500))
            }
            else if (profile === null) {
                reject(HTTPError(404))
            }
            else if (profile.profileSessions.includes(data.sessionToken)) {
                resolve()
            }
            else {
                reject(HTTPError(403))
            }
        })
    })
}

const performLogout = (data) => {
    return new Promise((resolve, reject) => {
        Profile.findOne({ profileEmail: data.emailAddress }, {}, { lean: true }, (error, profile) => {
            if (error) {
                console.log(error)
                reject(HTTPError(500))
            }
            else {
                profile.profileSessions.splice(profile.profileSessions.indexOf(data.sessionToken), 1)
                Profile.updateOne({ profileEmail: data.emailAddress }, {
                    $set: {
                        profileSessions: profile.profileSessions
                    }
                }, (error) => {
                    if (error) {
                        console.log(error)
                        reject(HTTPError(500))
                    }
                    else {
                        resolve()
                    }
                })
            }
        })
    })
}

module.exports.performRegister = performRegister
module.exports.performLogin = performLogin
module.exports.performSession = performSession
module.exports.performLogout = performLogout