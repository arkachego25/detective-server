var HTTPError = require('http-errors')
var LintStream = require('jslint').LintStream

// Executor
var Executor = require('../configs/executor')

// Models
var Snippet = require('../models/snippet')
var Profile = require('../models/profile')

const analyseSnippet = (snippet) => {
    return new Promise((resolve) => {
        switch (snippet.snippetLanguage) {
            case 'Javascript': {
                let lintStream = new LintStream()
                lintStream.write({ file: 'fileName', body: snippet.snippetContent })
                lintStream.on('data', (chunk) => {
                    snippet.snippetErrors = []
                    for (let i = 0; i < chunk.linted.errors.length; i++) {
                        if (chunk.linted.errors[i] !== null) {
                            snippet.snippetErrors.push({
                                errorLine: chunk.linted.errors[i].line,
                                errorCharacter: chunk.linted.errors[i].character,
                                errorString: chunk.linted.errors[i].reason
                            })
                        }
                    }
                    resolve(snippet)
                })
                break
            }
            default: {
                reject()
            }
        }
    })
    
}

const readSnippets = (session) => {
    return new Promise((resolve, reject) => {
        Snippet.aggregate([
            {
                $match: {
                    snippetEmail: session.emailAddress
                }
            },
            {
                $sort: {
                    snippetStamp: -1
                }
            },
            {
                $project: {
                    _id: 0,
                    __v: 0,
                    'snippetErrors._id': 0
                }
            }
        ], (error, snippets) => {
            if (error) {
                console.log(error)
                reject(HTTPError(500))
            }
            else {
                resolve(snippets)
            }
        })
    })
}

const createSnippet = (session, snippet) => {
    return new Promise((resolve, reject) => {
        Profile.findOne({ profileEmail: session.emailAddress }, { profileCounter: 1 }, (error, profile) => {
            if (error) {
                console.log(error)
                reject(HTTPError(500))
            }
            else {
                snippet.snippetId = profile.profileCounter
                snippet.snippetEmail = session.emailAddress
                snippet.snippetStamp = new Date()
                analyseSnippet(snippet).then((snippet) => {
                    Executor.Task()
                    .save(new Snippet(snippet))
                    .update(Profile, { profileEmail: session.emailAddress }, { $inc: { profileCounter: 1 } })
                    .run({ useMongoose: true })
                    .then(() => resolve(snippet))
                    .catch((error) => {
                        console.log(error)
                        reject(HTTPError(500))
                    })
                })
                
            }
        })
    })
}

const updateSnippet = (snippet) => {
    return new Promise((resolve, reject) => {
        snippet.snippetStamp = new Date()
        analyseSnippet(snippet).then((snippet) => {
            let snippetId = snippet.snippetId
            let snippetEmail = snippet.snippetEmail
            delete snippet['snippetId']
            delete snippet['snippetEmail']
            Snippet.updateOne({ snippetId: snippetId, snippetEmail: snippetEmail }, { $set: snippet }, (error) => {
                if (error) {
                    console.log(error)
                    reject(HTTPError(500))
                }
                else {
                    snippet.snippetId = snippetId
                    snippet.snippetEmail = snippetEmail
                    resolve(snippet)
                }
            })
        })
    })  
}

module.exports.readSnippets = readSnippets
module.exports.createSnippet = createSnippet
module.exports.updateSnippet = updateSnippet