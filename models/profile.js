var database = require('../configs/database')

var profileSchema = database.Schema({

    profileEmail:                       { type: String,                         maxlength: 100,     required: true,         unique: true },
    profilePasswords:                  [{ type: String,     minlength: 128,     maxlength: 128,     required: true                       }],
    profileAttempts: [{
        attemptStamp:                   { type: Date,                                               required: true                       },
        attemptDecision:                { type: String,     minlength: 8,       maxlength: 8,       required: true                       }
    }],
    profileSessions:                   [{ type: String,     minlength: 256,     maxlength: 256                                           }],
    profileCounter:                     { type: Number,     min: 1,                                 required: true                       }
    
})

module.exports = database.model('Profile', profileSchema)