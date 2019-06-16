var database = require('../configs/database')

var snippetSchema = database.Schema({

    snippetId:                          { type: Number,     min: 1,                                 required: true                       },
    snippetEmail:                       { type: String,                         maxlength: 100,     required: true                       },
    snippetStamp:                       { type: Date,                                               required: true                       },
    snippetLanguage:                    { type: String,                         maxlength: 20,      required: true                       },
    snippetContent:                     { type: String,                                             required: true                       },
    snippetErrors: [{
        errorLine:                      { type: Number,     min: 0,                                 required: true                       },
        errorCharacter:                 { type: Number,     min: 0,                                 required: true                       },
        errorString:                    { type: String,                                             required: true                       }
    }]
    
})

snippetSchema.index({ snippetId: 1, snippetEmail: 1 }, { unique: true })

module.exports = database.model('Snippet', snippetSchema)